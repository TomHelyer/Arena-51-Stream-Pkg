import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import Scoreboard from '../Scoreboard';
import { main, nameplate } from '../../Media/Scenes';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
    cont: {
        aspectRatio: "16/9",
        position: "relative"
    },
    caster: {
        position: "absolute",
        width: "50%",
        height: "50%",
        top: "25%",
    },
    caster2: {
        left: "50%",
    },
    background: {
        width: "100%",
        height: "100%",
        top: 0,
        position: "absolute",
        objectFit: "fill"
    },
    flipped: {
        transform: "scale(-1,1)"
    },
    nameCont:{
        display: "flex",
        position: "relative",
        top: "-26.5%",
        width: "100%",
    },
    name: {
        position: "absolute",
        fontSize: "3em",
        color: "white",
        marginTop: "0",
        marginBottom: "0",
        textAlign: "center",
        width: "33%",
        fontFamily: "technovier",
    },
    nameRight: {
        left: "67%"
    }
});

const CasterCams = () => {
    const styles = createStyles();
    const [casters, setCasters] = useState({} as CastersObject);

    useEffect(() => {
        fetch(`${apiUrl}/casters`).then(res => {
            res.json().then(val => setCasters(val)).catch(err => console.log(err))
        }).catch(err => console.log(err));

        const socket = io(apiUrl);

        socket.on('casters', (value: CastersObject) => {
            setCasters(value);
        })
    }, []);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <Scoreboard />
            <embed className={`${styles.caster}`} src={casters[0]?.vdo ?? "https://vdo.ninja/?view=XRmNCts&password=H3ll3r_G%40m3r&label=Arena51Caster1"}/>
            <embed className={`${styles.caster2} ${styles.caster}`} src={casters[1]?.vdo ?? "https://vdo.ninja/?view=mSuqjbX&password=H3ll3r_G%40m3r&label=Arena51Caster2"}/>
            <video className={styles.background} loop autoPlay src={nameplate}/>
            <video className={`${styles.background} ${styles.flipped}`} loop autoPlay src={nameplate}/>
            <div className={styles.nameCont}>
                <h1 className={styles.name}>{casters[0]? casters[0].name : ""}</h1>
                <h1 className={`${styles.name} ${styles.nameRight}`}>{casters[1]? casters[1].name : ""}</h1>
            </div>
        </div>
    )
}

export default CasterCams;