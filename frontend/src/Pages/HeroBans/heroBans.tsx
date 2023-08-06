import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main } from '../../Media/Scenes';
import HeroBanCard from './heroBanCard';
import heroLookup from '../../Media/Heroes';

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
        width: "30%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center"
    },
    heroContainerContainer: {
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    }
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
    useEffect(() => {
        fetch(`${apiUrl}/herobans`).then(res => {
            res.json().then(value => {
                setHeroBans({home:value.home, away:value.away});
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
        
        fetch(`${apiUrl}/scoreboard`).then(res => res.json().then((val: ScorebaordObject) => {

            setMatch(val.match);
        }));

        socket.on('scoreboard:match', val => {
            setMatch(val.match);
        });
        console.log("Test")
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
            <div className={styles.heroContainerContainer}>
                <div className={styles.heroContainer}>
                    {Object.keys(heroLookup.tank).map((key, idx) => {
                        const value = heroLookup.tank[key];
                        let bannedBy;
                        if (heroBans?.home.every(value => value && value!==key))
                            bannedBy = images[0];
                        if (heroBans?.away.every(value => value && value!==key))
                            bannedBy = images[1];
                        return <HeroBanCard hero={value} key={idx} banBy={bannedBy}/>
                    })}  
                </div>
                <div className={styles.heroContainer}>
                    {Object.values(heroLookup.dps).map((value, idx) => <HeroBanCard hero={value} key={idx}/>)}
                </div>
                <div className={styles.heroContainer}>
                    {Object.values(heroLookup.support).map((value, idx) => <HeroBanCard hero={value} key={idx}/>)}
                </div>
            </div>
        </div>
    )
}

export default HeroBans;