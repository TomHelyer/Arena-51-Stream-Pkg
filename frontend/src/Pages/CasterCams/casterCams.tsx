import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main, nameplate } from '../../Media/Scenes';

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
        position: "absolute",
        objectFit: "fill"
    },
    flipped: {
        transform: "scale(-1,1)"
    },
    nameCont:{
        display: "flex",
        position: "relative",
        top: "73%",
        width: "100%",
    },
    name: {
        position: "absolute",
        fontSize: "300%",
        color: "white",
        marginTop: "0",
        marginBottom: "0",
        textAlign: "center",
        width: "33%",
    },
    nameRight: {
        left: "67%"
    }
});

const CasterCams = () => {
    const styles = createStyles();
    const [casters, setCasters] = useState({} as CastersObject);

    useEffect(() => {
        fetch('http://localhost:8080/casters').then(res => {
            res.json().then(val => setCasters(val.casters)).catch(err => console.log(err))
        }).catch(err => console.log(err));

        const socket = io('http://localhost:8080');

        socket.on('casters', (value: CastersObject) => {
            setCasters(value);
        })
    }, []);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <embed className={`${styles.caster}`} src="https://vdo.ninja/?view=XRmNCts&password=H3ll3r_G%40m3r&label=Arena51Caster1"/>
            <embed className={`${styles.caster2} ${styles.caster}`} src="https://vdo.ninja/?view=mSuqjbX&password=H3ll3r_G%40m3r&label=Arena51Caster2"/>
            <video className={styles.background} src={nameplate}/>
            <video className={`${styles.background} ${styles.flipped}`} loop autoPlay src={nameplate}/>
            <div className={styles.nameCont}>
                <h1 className={styles.name}>{casters[0]? casters[0].name : ""}</h1>
                <h1 className={`${styles.name} ${styles.nameRight}`}>{casters[1]? casters[1].name : ""}</h1>
            </div>
        </div>
    )
}

export default CasterCams;