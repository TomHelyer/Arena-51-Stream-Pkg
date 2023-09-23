import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import mapLookup from "../../Media/Maps";
import CasterCams from "../CasterCams";
import NextMap from "../NextMap";
import Scoreboard from "../Scoreboard";
import { io } from "socket.io-client";
import HeroBans from "../HeroBans";
import heroLookup from "../../Media/HeroesIcons";
import { CastersObject, MatchInfoObject, CasterObject, NewTeam, MapState, MatchObject, State, ScoreBoardMapObject, TeamObject } from "../../../../types";

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const useStyles = createUseStyles({
  scene: {
    fontSize: `${500 / 1920}em`,
  },
  sceneCont: {
    width: "500px",
    minWidth: "200px",
    padding: "0.5%",
  },
  col: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap",
  },
  casterData: {
    display: "flex",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  hereBanData: {
    display: "flex",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    margin: "10px",
  },
  block: {
    flexGrow: "1",
  },
  logoPreview: {
    maxWidth: "12.5rem",
    maxHeight: "12.5rem",
    overflow: "hidden",
    margin: "0.5%",
  },
  logoPreviewImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

type ControlProps = {
  state: State;
  setState: (state: State) => void;
}

const Control = ({state, setState}: ControlProps) => {
  const styles = useStyles();

  const stateCopy = {...state};

  const {casters, match} = stateCopy;
  const {scoreboard, home, away} = match;
  const teamsAsArr = [home,away];
  const {maps} = scoreboard;

  const [matchId, setMatchId] = useState<string>("");
  const [matchList, setMatchList] = useState<string[]>([]);
  const [leagueId, setLeagueId] = useState<string>("");
  const [leagueList, setLeagueList] = useState<string[]>([]);

  const updateScore = (map: number, idx: number, number: number) => {
    stateCopy.match.scoreboard.maps[map].score[idx] = number;
    setState(stateCopy);
  }

  useEffect(() => {
    fetch(`${apiUrl}/matchlist/${leagueId}`)
      .then((res) => {
        res.json()
          .then((val) => {
            setMatchList(val.matchList);
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err));
  }, [leagueId])

  useEffect(() => {
    fetch(`${apiUrl}/matchstate/${matchId}`)
      .then((res) => {
        res.json()
          .then((val) => {
            setState(val);
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err));
  }, [matchId, setState]);

  return (
    <>
      <div>
        <h5>Caster Info</h5>
        {casters.map((val: CasterObject, idx: number) => {
          return (
            <div className={styles.casterData}>
              <div className={styles.block}>
                Caster Name:{" "}
                <input
                  type="text"
                  value={val ? val.name : ""}
                  onChange={(e) => {
                    stateCopy.casters[idx].name = e.target.value;
                    setState(stateCopy);
                  }}
                />
              </div>
              <div className={styles.block}>
                Caster VDO Link:{" "}
                <input
                  type="text"
                  placeholder="VDO ninja link here"
                  value={val ? val.vdo ?? undefined : undefined }
                  onChange={(e) => {
                    stateCopy.casters[idx].vdo = e.target.value;
                    setState(stateCopy);
                  }}
                />
              </div>
            </div>
          )
        })}


        <h5>Scoreboard</h5>
        {maps.map((map: ScoreBoardMapObject, idx: number) => {
          return (
            <div>
              <div>
                State:{" "}
                <select
                value={map.mapState}
                onChange={(e) => {
                  stateCopy.match.scoreboard.maps[idx].mapState = parseInt(e.target.value);
                  setState(stateCopy);
                }}
                >
                  <option value={0} key={0}>
                    Control/Push
                  </option>
                  <option value={1} key={1}>
                    Home Attack
                  </option>
                  <option value={2} key={2}>
                    Home Defence
                  </option>
                </select>
              </div>
              {map.score.map((value: number, i: number) => {
                return(
                  <div>
                    Score: {" " + value + " "}
                    <button
                      onClick={(e) => updateScore(idx,i,value + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={(e) => updateScore(idx,i,value - 1)}
                    >
                      -
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
        
        Team 1:{" "}
        <select
          value={match.home?.name}
          onChange={(e) => {
            fetch(`${apiUrl}/scoreboard/team`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ side: "home", team: e.target.value }),
            })
              .then((res: Response) => {
                res.json().then((val: MatchInfoObject) => {
                  setMatch(val);
                });
              })
              .catch((err) => console.log(err));
          }}
        >
          {teams.map((val: string, index: number) => (
            <option key={index} value={val}>
              {val}
            </option>
          ))}
        </select>
        Score: {score[0]}
        <button
          onClick={(e) => updateScore([score[0] + 1, score[1], score[2]])}
        >
          +
        </button>
        <button
          onClick={(e) => updateScore([score[0] > 0? score[0] - 1: score[0], score[1], score[2]])}
        >
          -
        </button>
        Team 2:{" "}
        <select
          value={match.away?.name}
          onChange={(e) => {
            fetch(`${apiUrl}/scoreboard/team`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ side: "away", team: e.target.value }),
            })
              .then((res: Response) => {
                res.json().then((val: MatchInfoObject) => {
                  setMatch(val);
                });
              })
              .catch((err) => console.log(err));
          }}
        >
          {teams.map((val: string, index: number) => (
            <option key={index} value={val}>
              {val}
            </option>
          ))}
        </select>
        Score: {score[1]}
        <button
          onClick={(e) => updateScore([score[0], score[1] + 1, score[2]])}
        >
          +
        </button>
        <button
          onClick={(e) => updateScore([score[0], score[1] > 0? score[1] - 1: score[1], score[2]])}
        >
          -
        </button>
        draws: {score[2]}
        <button
          onClick={(e) => updateScore([score[0], score[1], score[2] + 1])}
        >
          +
        </button>
        <button
          onClick={(e) => updateScore([score[0], score[1], score[2] > 0? score[2] - 1: score[2]])}
        >
          -
        </button>
        flip:{" "}
        <button
          onClick={(e) => {
            fetch(`${apiUrl}/scoreboard/flip`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ flip: !flip }),
            }).then((res: Response) => {
              res.json().then((val) => {
                setFlip(val.flip);
              });
            });
          }}
        >
          {flip ? "on" : "off"}
        </button>
        <button
          onClick={(e) => {
            updateScore([score[0] = 0, score[1] = 0, score[2] = 0])
            updateBans({home: [""],away: [""]})
          }}
        >
          reset score
        </button>

        <h5> Hero Bans <input type="checkbox" name="heroBansEnabled" onChange={(e) => setHeroBansEnabled(e.target.checked) }/></h5> 
        {heroBansEnabled ? (
          <>
            
            <div className={styles.hereBanData}>
              <div className={styles.block}>
                {match.home?.name}
                {heroBansState?.home.map((value, key) =>  
                <select
                  key={key}
                  value={heroBansState.home[key]}
                  onChange={(e) => {
                    const updatedSelectedValues = heroBansState.home;
                    updatedSelectedValues[key] = e.target.value;
                    const updatedHeroBansState = {
                      away: heroBansState.away,
                      home: updatedSelectedValues,
                    };
                    updateBans(updatedHeroBansState);
                  }}
                >
                  {[...Object.keys({...heroLookup.tank, ...heroLookup.dps, ...heroLookup.support}),""].sort()
                  .filter((v, k) => value===v || !((heroBansState.home.includes(v)) || (heroBansState.away.includes(v))))
                  .map((val, key) => {
                    return (
                      <option value={val} key={key}>
                        {val}
                      </option>
                    );
                  })}
                </select>
                
                )}
               
                <br></br>
                {match.away?.name}
                {heroBansState?.away.map((value, key) =>  
                <select
                  key={key}
                  value={heroBansState.away[key]}
                  onChange={(e) => {
                    const updatedSelectedValues = heroBansState.away;
                    updatedSelectedValues[key] = e.target.value;
                    const updatedHeroBansState = {
                      home: heroBansState.home,
                      away: updatedSelectedValues,
                    };
                    fetch(`${apiUrl}/heroBans`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ heroBans: updatedHeroBansState }),
                    }).catch((err) => console.log(err));
                  }}
                >
                  {[...Object.keys({...heroLookup.tank, ...heroLookup.dps, ...heroLookup.support}),""].sort()
                    .filter((v, k) => value===v || !((heroBansState.home.includes(v)) || (heroBansState.away.includes(v))))
                    .map((val, key) => {
                    return (
                      <option value={val} key={key}>
                        {val}
                      </option>
                    );
                  })}
                </select>
                
                )}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <h5>Add Team</h5>
        Name:{" "}
        <input
          type="text"
          value={uploadTeam.name}
          onChange={(e) => {
            setUploadTeam({
              ...uploadTeam,
              name: e.target.value,
            });
          }}
        />
        File:{" "}
        <input
          type="file"
          value={uploadTeam.target ?? ""}
          onChange={(e) => {
            setUploadTeam({
              ...uploadTeam,
              file: e.target.files?.[0] ?? undefined,
              target: e.target.value,
            });
          }}
        />
        {uploadTeam.file ? (
          <div className={styles.logoPreview}>
            <img alt="" src={URL.createObjectURL(uploadTeam.file)} className={styles.logoPreviewImage}
            />
          </div>
        ) : (
          ""
        )}
        <button
          onClick={(e) => {
            if (uploadTeam.name !== "" && uploadTeam.file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (!reader.result) return;
                let base64 = reader.result as String;
                fetch(`${apiUrl}/image/team/${uploadTeam.name}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    img: base64,
                  }),
                }).then((res: Response) => {
                  setUploadTeam({ name: "" });
                });
              };
              reader.readAsDataURL(uploadTeam.file);
            }
          }}
        >
          submit
        </button>
      </div>
      <h5>Previews <input type="checkbox" name="previewsEnabled" onChange={(e) => setPreviewEnabled(e.target.checked) }/></h5>
      {previewsEnabled && 
        <div className={styles.col}>
          <div className={styles.sceneCont}>
            <h3>/NextMap</h3>
            <div className={styles.scene}>
              <NextMap muted={true} />
            </div>
          </div>
          <div className={styles.sceneCont}>
            <h3>/CasterCams</h3>
            <div className={styles.scene}>
              <CasterCams />
            </div>
          </div>
          <div className={styles.sceneCont}>
            <h3>/ScoreBoard</h3>
            <div className={styles.scene}>
              <Scoreboard displayDemo={true} />
            </div>
          </div>
          <div className={styles.sceneCont}>
            <h3>/HeroBans</h3>
            <div className={styles.scene}>
              <HeroBans />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Control;