import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import mapLookup from "../../Media/Maps";
import CasterCams from "../CasterCams";
import NextMap from "../NextMap";

const useStyles = createUseStyles({
    scene: {
        fontSize: "4px"
    },
    sceneCont: {
        width: "24%",
        minWidth: "200px",
        padding: "0.5%",
    },
    col: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
    }
});

const Control = () => {
    const [map, setMap] = useState("");
    const [casters, setCasters]= useState({} as CastersObject);
    const styles = useStyles();

    useEffect(() => {
        fetch('http://localhost:8080/nextmap').then(res => {
            res.json().then(val => setMap(val.map)).catch(err => console.log(err))
        }).catch(err => console.log(err));

        fetch('http://localhost:8080/casters').then(res => {
            res.json().then(val => setCasters(val.casters)).catch(err => console.log(err))
        }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if(casters[0] && casters[1]){
            fetch('http://localhost:8080/casters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "casters": casters
                })
            }).catch(err => console.log(err));
        }   
    }, [casters])

    return (
    <>
        <div>
            <select value={map} onChange={(e) => {
                setMap(e.target.value);
                fetch('http://localhost:8080/nextmap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "map": e.target.value
                    })
                }).catch(err => console.log(err));
            }}>
                {
                    Object.keys(mapLookup).map((val, key) => {
                        return <option value={val} key={key}>{val}</option>
                    })
                }
            </select>
            <input type="text" value={casters[0]? (casters[0] as CasterObject).name : ""} onChange={(e) => {
                setCasters({...casters,
                    0: {
                        name: e.target.value,
                        vdo: casters[0]?.vdo
                    }
                }
                    
                );
            }}/>
            <input type="text" value={casters[1]? (casters[1] as CasterObject).name: ""} onChange={(e) => {
                setCasters({...casters,
                    1: {
                        name: e.target.value,
                        vdo: casters[1]?.vdo
                    }
                });
            }}/>
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
        </div>
    </>
    )
}

export default Control;