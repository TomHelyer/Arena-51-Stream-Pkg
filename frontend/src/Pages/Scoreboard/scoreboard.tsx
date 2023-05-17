import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

enum matchStates{
    Home = 1,
    Away = -1,
    Draw = 0,
    NoResult = ""
}

const createStyles = createUseStyles({
    frame: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        fontFamily: "technovier",
        fontSize: "200%",
        textAlign: "center",
        justifyContent: "space-between",
        aspectRatio: `${1920/1080}`,
    },
    home: {
        display: "flex",
        flexDirection: "row",
        width: "35%",
        height: "5%",
        backgroundColor: "blue",
    },
    away: {
        display: "flex",
        flexDirection: "row-reverse",
        width: "35%",
        height: "5%",
        backgroundColor: "red",
    },
    logo:{
        backgroundColor: "white",
        width: "10%",
        aspectRatio: 1,
    },
    img: {
        width: "100%",
        height: "100%"
    },
    teamName: {
        width: "70%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    score: {
        width: "10%",
        fontSize: "130%",
    },
    icon: {
        width: "10%",
        backgroundColor: "white",
        fontSize: "160%",
    },
    text: {
        padding: "0",
        margin: "0"
    }
});

const Scoreboard = () => {
    const styles = createStyles();
    const [images, setImages] = useState(["",""]);
    const [match, setMatch] = useState<MatchInfoObject>({
        home: {
            name: "home",
            sr: 0,
        },
        away: {
            name: "away",
            sr: 0
        },
        state: matchStates.NoResult
    });
    const [score, setScore] = useState([0,0]);

    useEffect(() => {
        fetch('http://localhost:8080/scoreboard').then(res => res.json().then((val: ScorebaordObject) => {
            setMatch(val.match);
            setScore(val.score);
        }))
    }, []);

    useEffect(() => {
        Promise.all([
        fetch(`http://localhost:8080/image/team/${match.home.name.toLowerCase()}`).then(res => {
            if(res.status === 200)
                return res.json().then(val => val.image);

            console.log("Error code: ", res.status);
            return 
        }),
        fetch(`http://localhost:8080/image/team/${match.away.name.toLowerCase()}`).then(res => {
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
        <div className={styles.frame}>
            <div className={styles.home}>
                <div className={styles.logo}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[0]}`} alt={match.home.name}/>
                </div>
                <div className={styles.teamName}>
                    <p className={styles.text}>{match.home.name}</p>
                </div>
                <div className={styles.score}>
                    <p className={styles.text}>{score[0]}</p>
                </div>
                <div className={styles.icon}>
                    <i className="ri-arrow-right-fill"></i>
                </div>
            </div>

            <div className={styles.away}>
                <div className={styles.logo}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[1]}`} alt={match.away.name}/>
                </div>

                <div className={styles.teamName}>
                    <p className={styles.text}>{match.away.name}</p>
                </div>

                <div className={styles.score}>
                    <p className={styles.text}>{score[1]}</p>
                </div>

                <div className={styles.icon}>
                    <i className="ri-arrow-left-fill"></i>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard;