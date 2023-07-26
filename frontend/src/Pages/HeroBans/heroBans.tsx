import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main } from '../../Media/Scenes';
import HeroBanCard from './heroBanCard';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
    cont: {
        aspectRatio: "16/9",
        position: "relative"
    },
    background: {
        width: "100%",
        height: "100%",
        position: "absolute",
        objectFit: "fill"
    },
    heroContainer: {
        position: "relative",
        top: `${204 * 100/1080}%`,
        height: `${300 * 100/1080}%`,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    heroContainerAway: {
        position: "relative",
        top: `${(276 * 100/1080)}%`,
        height: `${300 * 100/1080}%`,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});

const HeroBans = () => {
    const styles = createStyles();

    const [heroBans, setHeroBans] = useState<{home: string[], away: string[]}>();

    useEffect(() => {
        fetch(`${apiUrl}/herobans`).then(res => {
            res.json().then(value => {
                setHeroBans(value as {home: string[], away: string[]});
            })
            .catch (err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });

        const socket = io(apiUrl);

        socket.on('heroBans', (heroBans) => {
            setHeroBans(heroBans.heroBans);
        });

    }, []);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <div className={styles.heroContainer}>
                {heroBans?.home.map((value, idx) => <HeroBanCard hero={value} key={idx}/>)}
            </div>
            <div className={styles.heroContainerAway}>
                {heroBans?.home.map((value, idx) => <HeroBanCard hero={value} key={idx}/>)}
            </div>
        </div>
    )
}

export default HeroBans;