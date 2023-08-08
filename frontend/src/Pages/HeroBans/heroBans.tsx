import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main, nameplate } from '../../Media/Scenes';
import HeroBanCard from './heroBanCard';
import heroLookup from '../../Media/HeroesIcons';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
    cont: {
        aspectRatio: "16/9",
        position: "relative",
        overflow: "hidden"
    },
    title: {
        width: "140%",
        aspectRatio: `${16/9}`,
        position: "absolute",
        top: "-22%",
        objectFit: "fill",
        transform: "scale(-1,-1)"
    },
    background: {
        width: "100%",
        height: "100%",
        top: 0,
        position: "absolute",
        objectFit: "fill"
    },
    heroContainer: {
        position: "relative",
        width: "28%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "start",
        justifyContent: "center",
    },
    dpsContainer: {
        position: "relative",
        width: "47%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "start",
        justifyContent: "center"
    },
    heroContainerContainer: {
        position: "absolute",
        top: "15%",
        height: "74%",
        width: "94%",
        alignSelf: "center",
        padding: "3%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    nameCont:{
        position: "relative",
        top: "7.2%",
        width: "100%",
    },
    name: {
        fontSize: "6em",
        color: "white",
        marginTop: "0",
        marginBottom: "0",
        textAlign: "center",
        width: "45%",
        fontFamily: "Infinity",
    },
});

const HeroBans = () => {
    const styles = createStyles();

    const [heroBans, setHeroBans] = useState<{home: string[], away: string[]}>();
    const [images, setImages] = useState(["",""]);
    const [match, setMatch] = useState<MatchInfoObject>({
        home: {
            name: "home",
            rank: "Bronze",
        },
        away: {
            name: "away",
            rank: "Bronze",
        }
    });
    const [score, setScore] = useState<ScoreObject>([0,0,0]);

    useEffect(() => {
        fetch(`${apiUrl}/herobans`).then(res => {
            res.json().then(value => {
                setHeroBans(value.heroBans);
            })
            .catch (err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
        
        fetch(`${apiUrl}/scoreboard`).then(res => res.json().then((val: ScorebaordObject) => {
            setMatch(val.match);
            setScore(val.score);
        }));

        const socket = io(apiUrl);

        socket.on('heroBans', (value) => {
            setHeroBans(value.heroBans);
        });

        socket.on('scoreboard:match', val => {
            setMatch(val.match);
        });

        socket.on('scoreboard:score', val => {
            setScore(val.score);
        });
    }, []);

    useEffect(() => {
        Promise.all([
        fetch(`${apiUrl}/image/team/${match.home.name}`).then(res => {

            if(res.status === 200)
                return res.json().then(val => val.image);

            console.log("Error code: ", res.status);
            return 
        }),
        fetch(`${apiUrl}/image/team/${match.away.name}`).then(res => {

            if(res.status === 200)
                return res.json().then(val => val.image);

            console.log("Error code: ", res.status);
            return 
        }),
        ]).then(val => {
            setImages(val);
        });
    }, [match]);

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            {
                //<video className={styles.title} loop autoPlay src={nameplate}/>
            }
            <div className={styles.nameCont}>
                <h1 className={styles.name}>{`Map ${(score[0] + score[1] + score[2] + 1)} Bans`}</h1>
            </div>
            <div className={styles.heroContainerContainer}>
                <div className={styles.heroContainer}>
                    {Object.keys(heroLookup.tank).map((key, idx) => {
                        const img = heroLookup.tank[key];
                        let bannedBy = undefined;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy}/>
                    })}
                </div>
                <div className={styles.dpsContainer}>
                    {Object.keys(heroLookup.dps).map((key, idx) => {
                        const img = heroLookup.dps[key];
                        let bannedBy = undefined;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy}/>
                    })}
                </div>
                <div className={styles.heroContainer}>
                {Object.keys(heroLookup.support).map((key, idx) => {
                        const img = heroLookup.support[key];
                        let bannedBy = undefined;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default HeroBans;