import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import mapLookup from "../../Media/Maps";
import mapLookupAdvanced from "../../Media/Images/Maps";
import CasterCams from "../CasterCams";
import NextMap from "../NextMap";
import Scoreboard from "../Scoreboard";
import { io } from "socket.io-client";
import HeroBans from "../HeroBans";
import heroLookup from "../../Media/HeroesIcons";
import MapOverview from "../MapOverview";

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

const Control = () => {
  const [map, setMap] = useState("");
  const [casters, setCasters] = useState<CastersObject>([]);
  const [score, setScore] = useState<number[]>([0, 0, 0]);
  const [match, setMatch] = useState<MatchInfoObject>({} as MatchInfoObject);
  const [mapState, setMapState] = useState<mapState>(0);
  const [flip, setFlip] = useState<boolean>(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [heroBansEnabled, setHeroBansEnabled] = useState(false);
  const [previewsEnabled, setPreviewEnabled] = useState(false);
  const [heroBansState, setHeroBansState] = useState<{home: string[], away: string[]}>();
  const [uploadTeam, setUploadTeam] = useState<newTeam>({
    name: "",
  });
  const [mapAdvanced, setMapAdvanced] = useState("");
  const styles = useStyles();

  const updateScore: (score: number[]) => void = (score) => {
    setScore(score);
    fetch(`${apiUrl}/scoreboard/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: score }),
    }).catch((err) => console.log(err));
  };


  const updateBans: (bans: {home: string[], away: string[]}) => void = (bans) => {
    setHeroBansState(bans);
    fetch(`${apiUrl}/heroBans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ heroBans: bans }),
    }).catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch(`${apiUrl}/nextmap`)
      .then((res) => {
        res
          .json()
          .then((val) => setMap(val.map))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    fetch(`${apiUrl}/casters`)
      .then((res) => {
        res
          .json()
          .then((val) => setCasters(val))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    fetch(`${apiUrl}/scoreboard`).then((res) => {
      if (res.status === 200)
        res.json().then((val) => {
          setScore(val.score);
          setMatch(val.match);
          setMapState(val.mapState);
          setFlip(val.flip);
        });
    });

    fetch(`${apiUrl}/imagelist/${"team"}`).then((res) => {
      if (res.status === 200)
        res.json().then((val) => {
          setTeams(val);
        });
    });

    fetch(`${apiUrl}/mapoverview`)
      .then((res) => {
        res
          .json()
          .then((val) => setMapAdvanced(val.mapAdvanced))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    fetch(`${apiUrl}/herobans`).then(res => {
      res.json().then(value => {
          setHeroBansState(value.heroBans);
      })
      .catch (err => {
          console.log(err);
      });
    }).catch(err => {
        console.log(err);
    });

    const socket = io(apiUrl);

    socket.on('heroBans', (value) => {
      setHeroBansState(value.heroBans);
    });

    socket.on('mapAdvanced', (value) => {
      setMapAdvanced(value.mapAdvanced);
    });

    socket.on("scoreboard:mapState", (val) => {
      setMapState(val.mapState);
    });

    socket.on("scoreboard:score", (val) => {
      setScore(val.score);
    });

    socket.on("scoreboard:match", (val) => {
      setMatch(val.match);
    });

    socket.on("scoreboard:flip", (val) => {
      setFlip(val.flip);
    });

    socket.on("teams", (val) => {
      setTeams(val.teams);
    });
  }, []);

  useEffect(() => {
    if (casters[0] && casters[1]) {
      fetch(`${apiUrl}/casters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(casters),
      }).catch((err) => console.log(err));
    }
  }, [casters]);
  return (
    <>
      <div>
        <h5>Next Map</h5>
        <select
          value={map}
          onChange={(e) => {
            setMap(e.target.value);
            fetch(`${apiUrl}/nextmap`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ map: e.target.value }),
            }).catch((err) => console.log(err));
          }}
        >
          {Object.keys(mapLookup).map((val, key) => {
            return (
              <option value={val} key={key}>
                {val}
              </option>
            );
          })}
        </select>

        <h5>New Map Selection and Controls</h5>
        <div>
          Map1
          <p></p>
          <select
          value={mapAdvanced}
          onChange={(e) => {
            setMapAdvanced(e.target.value);
            fetch(`${apiUrl}/mapoverview`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ mapAdvanced: e.target.value }),
            }).catch((err) => console.log(err));
          }}
        >
          {[...Object.keys({...mapLookupAdvanced.control, ...mapLookupAdvanced.escort, ...mapLookupAdvanced.flashpoint, ...mapLookupAdvanced.hybrid, ...mapLookupAdvanced.push}),"None"].sort()
          .map((val, key) => {
            return (
              <option value={val} key={key}>
                {val}
              </option>
            );
          })}
        </select>
        <p></p>
        <input 
          type="number" 
          name="score home" 
          min="0" 
          max="20" 
          value="0"
        /> 
        <input 
          type="number"  
          name="score away" 
          min="0" 
          max="20"
          value="0"
        />
        <p></p>
        Completed?
        <input type="checkbox" name="map1Completed"/>
        </div>


        <h5>Caster Info</h5>
        <div className={styles.casterData}>
          <div className={styles.block}>
            Caster Name:{" "}
            <input
              type="text"
              value={casters[0] ? (casters[0] as CasterObject).name : ""}
              onChange={(e) => {
                setCasters([
                  {
                    name: e.target.value,
                    vdo: casters[0]?.vdo,
                  },
                  casters[1],
                ]);
              }}
            />
          </div>
          <div className={styles.block}>
            Caster VDO Link:{" "}
            <input
              type="text"
              placeholder="VDO ninja link here"
              value={
                casters[0]
                  ? (casters[0] as CasterObject).vdo ?? undefined
                  : undefined
              }
              onChange={(e) => {
                setCasters([
                  {
                    name: casters[0]?.name ?? "",
                    vdo: e.target.value,
                  },
                  casters[1],
                ]);
              }}
            />
          </div>
        </div>
        <div className={styles.casterData}>
          <div className={styles.block}>
            Caster Name:{" "}
            <input
              type="text"
              value={casters[1] ? (casters[1] as CasterObject).name : ""}
              onChange={(e) => {
                setCasters([
                  casters[0],
                  {
                    name: e.target.value,
                    vdo: casters[1]?.vdo,
                  },
                ]);
              }}
            />
          </div>
          <div className={styles.block}>
            Caster VDO Link:{" "}
            <input
              type="text"
              placeholder="VDO ninja link here"
              value={
                casters[1]
                  ? (casters[1] as CasterObject).vdo ?? undefined
                  : undefined
              }
              onChange={(e) => {
                setCasters([
                  casters[0],
                  {
                    name: casters[1]?.name ?? "",
                    vdo: e.target.value,
                  },
                ]);
              }}
            />
          </div>
        </div>
        <h5>Scoreboard</h5>
        Current Map State:{" "}
        <select
          value={mapState}
          onChange={(e) => {
            setMapState(parseInt(e.target.value));
            fetch(`${apiUrl}/scoreboard/mapState`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ mapState: e.target.value }),
            }).catch((err) => console.log(err));
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
          <div className={styles.sceneCont}>
            <h3>/MapOverview</h3>
            <div className={styles.scene}>
              <MapOverview />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Control;