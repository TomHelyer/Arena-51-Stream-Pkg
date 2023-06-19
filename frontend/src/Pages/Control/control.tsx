import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import mapLookup from "../../Media/Maps";
import CasterCams from "../CasterCams";
import NextMap from "../NextMap";
import Scoreboard from "../Scoreboard";
import { io } from "socket.io-client";

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const useStyles = createUseStyles({
    scene: {
        fontSize: `${500/1920}em`
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
    casterData:{
        display: "flex",
        alignContent: "flex-start",
        justifyContent: "flex-start",
    },
    block:{
        flexGrow: "1",
    }
});

const Control = () => {
    const [map, setMap] = useState("");
    const [casters, setCasters]= useState<CastersObject>([]);
    const [score, setScore] = useState<number[]>([0,0]);
    const [match, setMatch] = useState<MatchInfoObject>({} as MatchInfoObject);
    const [mapState, setMapState] = useState<mapState>(0);
    const [flip, setFlip] = useState<boolean>(false);
    const [teams, setTeams] = useState<string[]>([]);
    const [uploadTeam, setUploadTeam] = useState<newTeam>({
        name: "",
    });
    const styles = useStyles();

    const updateScore: (score: number[]) => void = (score) => {
        setScore(score);
        fetch(`${apiUrl}/scoreboard/score`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score: score})
                }).catch(err => console.log(err));
    }

    useEffect(() => {
        fetch(`${apiUrl}/nextmap`).then(res => {
            res.json().then(val => setMap(val.map)).catch(err => console.log(err))
        }).catch(err => console.log(err));


        fetch(`${apiUrl}/casters`).then(res => {
            res.json().then(val => setCasters(val)).catch(err => console.log(err))
        }).catch(err => console.log(err));

        fetch(`${apiUrl}/scoreboard`).then(res => {
            if(res.status === 200)
                res.json().then(val => {
                    setScore(val.score);
                    setMatch(val.match);  
                    setMapState(val.mapState);
                    setFlip(val.flip);
                })
        });


        fetch(`${apiUrl}/teams/list`).then(res => {
            if(res.status === 200)
                res.json().then(val => {
                    setTeams(val);
                })
        })

        const socket = io(apiUrl);

        socket.on('scoreboard:mapState', (val) => {
            setMapState(val.mapState);
        });

        socket.on('scoreboard:score', (val) => {
            setScore(val.score);
        });

        socket.on('scoreboard:match', (val) => {
            setMatch(val.match);
        });

        socket.on('scoreboard:flip', (val) => {
            setFlip(val.flip);
        });

        socket.on('teams', (val) => {
            setTeams(val.teams);
        })
    }, []);

    useEffect(() => {
        if(casters[0] && casters[1]){
            fetch(`${apiUrl}/casters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(casters)
            }).catch(err => console.log(err));
        }   
    }, [casters])

    return (
    <>
        <div>
            <h5>Next Map</h5>
            <select value={map} onChange={(e) => {
                setMap(e.target.value);
                fetch(`${apiUrl}/nextmap`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ map: e.target.value})
                }).catch(err => console.log(err));
            }}>
                {
                    Object.keys(mapLookup).map((val, key) => {
                        return <option value={val} key={key}>{val}</option>
                    })
                }
            </select>
            <h5>Caster Info</h5>
            <div className={styles.casterData}>
                <div className={styles.block}>
                    Caster Name: <input type="text" value={casters[0]? (casters[0] as CasterObject).name : ""} onChange={(e) => {
                        setCasters([{
                                name: e.target.value,
                                vdo: casters[0]?.vdo
                            },casters[1]
                        ]);
                    }}/>
                </div>
                <div className={styles.block}>
                    Caster VDO Link: <input type="text" placeholder="VDO ninja link here" value={casters[0]? (casters[0] as CasterObject).vdo ?? undefined: undefined} onChange={(e) => {
                        setCasters([
                            {
                                name: casters[0]?.name ?? "",
                                vdo: e.target.value
                            },casters[1]
                        ]);
                    }}/>
                </div>
            </div>
            
            <div className={styles.casterData}>
                <div className={styles.block}>
                    Caster Name: <input type="text" value={casters[1]? (casters[1] as CasterObject).name: ""} onChange={(e) => {
                        setCasters({...casters,
                            1: {
                                name: e.target.value,
                                vdo: casters[1]?.vdo
                            }
                        });
                    }}/>
                </div>
                <div className={styles.block}>
                    Caster VDO Link: <input type="text" placeholder="VDO ninja link here" value={casters[1]? (casters[1] as CasterObject).vdo ?? undefined: undefined} onChange={(e) => {
                        setCasters({...casters,
                            0: {
                                name: casters[1]?.name ?? "",
                                vdo: e.target.value
                            }
                        });
                    }}/>
                </div>
            </div>

            <h5>Scoreboard</h5>

            Current Map State: <select value={mapState} onChange={(e) => {
                setMapState(parseInt(e.target.value));
                fetch(`${apiUrl}/scoreboard/mapState`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mapState: e.target.value})
                }).catch(err => console.log(err));
            }}>
                <option value={0} key={0}>Control/Push</option>
                <option value={1} key={1}>Home Attack</option>
                <option value={2} key={2}>Home Defence</option>
            </select>

            Team 1: <select value={match.home?.name} onChange={(e) => {
                fetch(`${apiUrl}/scoreboard/team`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({side: "home", team: e.target.value})
                })
                .then((res: Response) => {
                    res.json().then((val: MatchInfoObject) => {
                        setMatch(val);
                    })
                }).catch(err => console.log(err));
            }}>
                {teams.map((val: string, index: number) => <option key={index} value={val}>{val}</option>)}
            </select>

            Score: {score[0]}
            <button onClick={(e) => updateScore([score[0] + 1, score[1]])}>+</button>
            <button onClick={(e) => updateScore([score[0] - 1, score[1]])}>-</button>

            Team 2: <select value={match.away?.name} onChange={(e) => {
                fetch(`${apiUrl}/scoreboard/team`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({side: "away", team: e.target.value})
                })
                .then((res: Response) => {
                    res.json().then((val: MatchInfoObject) => {
                        setMatch(val);
                    })
                }).catch(err => console.log(err));
            }}>
                {teams.map((val: string, index: number) => <option key={index} value={val}>{val}</option>)}
            </select>

            Score: {score[1]}
            <button onClick={(e) => updateScore([score[0], score[1] + 1])}>+</button>
            <button onClick={(e) => updateScore([score[0], score[1] - 1])}>-</button>

            flip: <button onClick={(e) => {
                fetch(`${apiUrl}/scoreboard/flip`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({flip: !flip})
                }).then((res: Response) => {
                    res.json().then((val) => {
                        setFlip(val.flip);
                    })
                })
            }}>{flip? "on": "off"}</button>

            <h5>Add Team</h5>
            Name: <input type="text" value={uploadTeam.name} onChange={(e) => {
                setUploadTeam({
                    ...uploadTeam,
                    name: e.target.value
                });
            }}/>

            File: <input type="file" value={uploadTeam.target??""} onChange={(e) => {
                setUploadTeam({
                    ...uploadTeam,
                    file: (e.target.files?.[0]??undefined),
                    target: e.target.value
                });
            }}/>{uploadTeam.file? 
                <img alt="" src={URL.createObjectURL(uploadTeam.file)}/>
                : ""}
            <button onClick={(e) => {
                if(uploadTeam.name !== "" && uploadTeam.file)
                {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if(!reader.result)
                            return;
                        let base64 = reader.result as String;
                        fetch(`${apiUrl}/teams/add`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({name: uploadTeam.name, logo: base64.split(',')[1]})
                        }).then((res: Response) => {
                            setUploadTeam({name:""});
                        });
                    }
                    reader.readAsDataURL(uploadTeam.file);
                }
            }}>submit</button>
        </div>
        <div className={styles.col}>
            <div className={styles.sceneCont}>
                <h3>Next Map</h3>
                <div className={styles.scene}>
                    <NextMap muted={true}/>
                </div>
            </div>
            <div className={styles.sceneCont}>
                <h3>Caster Cams</h3>
                <div className={styles.scene}>
                    <CasterCams />
                </div>
            </div>
            <div className={styles.sceneCont}>
                <h3>ScoreBoard</h3>
                <div className={styles.scene}>
                    <Scoreboard />
                </div>
            </div>
        </div>
    </>
    )
}



export default Control;