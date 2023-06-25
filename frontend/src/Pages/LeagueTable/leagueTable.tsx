import { useEffect, useRef, useState } from 'react';
import {createUseStyles} from 'react-jss';
//import { io } from 'socket.io-client';
import { main } from '../../Media/Scenes';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const colors = ["green", "blue", "red"];

const createStyles = createUseStyles({
    cont: {
        aspectRatio: "16/9",
        position: "relative",
        fontFamily: "Infinity",
        fontSize: "200%",
    },
    background: {
        width: "100%",
        height: "100%",
        position: "absolute",
        objectFit: "fill",
        zIndex: 0,
    },
    playoffCol: {
        backgroundColor: colors[1],
    },
    promoCol: {
        backgroundColor: colors[0],
    },
    reliCol: {
        backgroundColor: colors[2],
    },
    text: {
        paddin: "0",
        margin: "0",
    },
    table: {
        display: "flex",
        alignContent: "center",
        flexDirection: "column",
        width: "70%",
        zIndex: 1,
        position: "relative",
        backgroundColor: "white",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "10%",
    },
    row: {
        height: "10%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    teamName: {
        flexGrow: 1,
    },
    teamLogo: {

    },
    points: {
        aspectRatio: 1,
        alignContent: "center",
    },
    wld: {
        aspectRatio: 1,
        alignContent: "center",
        display: 'flex',
        flexDirection: "row"
    }
});

const LeagueTable = () => {
    const styles = createStyles();

    const [teams, setTeams] = useState<teamInfoObject[]>([]);
    const [table, setTable] = useState<tableInfoObject>([]);

    useEffect(() => {
        fetch(`${apiUrl}/league/demo`).then(res => {
            res.json().then((val: leagueInfoObject) => {
                setTeams(val.teams);
                setTable(val.table);
                for(let i = 0; i < val.teams.length; i++){
                    fetch(`${apiUrl}/image/team/${val.teams[i]}`)
                    .then(resteam => resteam.json().then((image) => {
                        setTeams(t => [...t, {...t[i],logo: image}]);
                    })).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
        //const socket = io(apiUrl);
    }, []);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <div className={styles.table}>
                <div className={styles.header}>
                    <div className={styles.points}>
                        <p className={styles.text}>Rank</p>
                    </div>
                    <div className={styles.teamName}>
                        <p className={styles.text}>Name</p>
                    </div>
                    <div className={styles.points}>
                        <p className={styles.text}>Points</p>
                    </div>
                    <div className={styles.wld}>
                        <p className={styles.text}>W</p>
                        <p className={styles.text}>D</p>
                        <p className={styles.text}>L</p>
                    </div>
                </div>
                {
                    table.map((val: tableRowInfoObject, idx: number) => {
                        return (
                        <div className={styles.row}>
                            <div className={styles.points}>
                                <p className={styles.text}>{idx + 1}</p>
                            </div>
                            <div className={styles.teamName}>
                                <p className={styles.text}>{teams[val.team].name}</p>
                            </div>
                            <div className={styles.points}>
                                <p className={styles.text}>{val.points}</p>
                            </div>
                            <div className={styles.wld}>
                                <p className={styles.text}>{val.w}</p>
                                <p className={styles.text}>{val.d}</p>
                                <p className={styles.text}>{val.l}</p>
                            </div>
                        </div>)
                    })
                }
                <div className={styles.row}>

                </div>
            </div>
        </div>
    )
}

export default LeagueTable;