import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import mapLookup from '../../Media/Maps';
import { main } from '../../Media/Scenes';

const createStyles = createUseStyles({
    cont: {
        aspectRatio: "16/9",
        position: "relative"
    },
    caster: {
        position: "absolute",
        width: `${600 * 100/1920}%`,
        height: `${336 * 100/1080}%`,
        left: `${1320 * 100/1920}%`,
    },
    caster1: {
        top: `${204 * 100/1080}%`,
    },
    caster2: {
        top: `${540 * 100/1080}%`,
    },
    map: {
        top: `${204 * 100/1080}%`,
        width: `${1320 * 100/1920}%`,
        height: `${672 * 100/1080}%`,
        position: "absolute",
        objectFit: "cover",
    },
    background: {
        width: "100%",
        height: "100%",
        position: "absolute",
        objectFit: "fill"
    }
});

const NextMap = ({muted}: NextMapProps) => {
    const styles = createStyles();

    const [map, setMap] = useState("");
    const [casters, setCasters] =  useState({} as CastersObject);

    useEffect(() => {
        fetch("http://localhost:8080/nextmap").then(res => {
            res.json().then(value => {
                setMap(value.map as string);
            })
            .catch (err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });

        const socket = io('http://localhost:8080');

        socket.on('nextmap', (map) => {
            setMap(map);
        });

        socket.on('casters', val => {
            setCasters(val);
        })

    }, []);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <video className={styles.map} loop autoPlay muted={muted} src={mapLookup[map as keyof object]}/>
            <embed className={`${styles.caster1} ${styles.caster}`} src={casters[0]?.vdo? casters[0].vdo : "https://vdo.ninja/?view=XRmNCts&password=H3ll3r_G%40m3r&label=Arena51Caster1"}/>
            <embed className={`${styles.caster2} ${styles.caster}`} src={casters[1]?.vdo? casters[1].vdo : "https://vdo.ninja/?view=mSuqjbX&password=H3ll3r_G%40m3r&label=Arena51Caster2"}/>
        </div>
    )
}

type NextMapProps = {
    muted?: boolean;
}

export default NextMap;