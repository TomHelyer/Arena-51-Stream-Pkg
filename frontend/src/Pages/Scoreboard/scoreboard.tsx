import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import push from './arrow-right-fill.svg';
import def from './shield-fill.svg';
import att from './sword-fill.svg';
import { io } from 'socket.io-client';
const image = require('./Capture.PNG');

const homeMapStates = [push, att, def];
const awayMapStates = [push, def, att];
//d63750
//2fbbde

const createStyles = createUseStyles({
    frame: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        fontFamily: "technovier",
        fontSize: "150%",
        textAlign: "center",
        justifyContent: "space-between",
        aspectRatio: `${1920/1080}`,
        //backgroundImage: `url(${image})`, //uncomment this line for styling
        backgroundSize: "100%",
        boxSizing: "border-box",
        paddingTop: "0.8%",
        paddingLeft: "2.25%",
        paddingRight: "2.25%",
    },
    homeCol: {
        backgroundColor: "#2fbbde"
    },
    awayCol: {
        backgroundColor: "#d63750",
    },
    team: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: "28.55%",
        height: "3.5%",
        boxShadow: "-5px 10px 20px black",
    },
    away: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        width: "30%",
        height: "3.5%",
    },
    logo:{
        backgroundColor: "white",
        height: "100%",
        aspectRatio: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    img: {
        width: "90%",
        height: "90%",
    },
    transImg: {
        opacity: "0.3",
        width: "90%",
        filter: "blur(2px)",
    },
    backgroundImg: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    teamName: {
        backgroundColor: "white",
        borderLeft: "2px solid",
        borderRight: "2px solid",
    },
    textOnTop: {
        position: "relative",
        top: "-100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    score: {
        width: "10%",
        fontSize: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: "white",
        borderLeft: "2px solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        padding: "0",
        margin: "0"
    },
    flip: {
        transform: "scaleX(-1)"
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
        }
    });
    const [score, setScore] = useState([0,0]);
    const [mapState, setMapState] = useState<mapState>(0);

    useEffect(() => {
        fetch('http://localhost:8080/scoreboard').then(res => res.json().then((val: ScorebaordObject) => {
            setMatch(val.match);
            setScore(val.score);
            setMapState(val.mapState)
        }));

        const socket = io('http://localhost:8080');

        socket.on('scoreboard:score', (score) => {
            setScore(score);
        });

        socket.on('scoreboard:match', val => {
            setMatch(val);
        });

        socket.on('scoreboard:mapState', (state) => {
            setMapState(state);
        })

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
            <div className={styles.team}>
                <div className={styles.logo}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[0]}`} alt={match.home.name[0]}/>
                </div>
                <div className={styles.teamName}>
                    <div className={styles.backgroundImg}>
                        <img className={styles.transImg} src={`data:image/png;base64, ${images[0]}`} alt={""}/>
                    </div>
                    <div className={styles.textOnTop}>
                        <p className={styles.text}>{match.home.name}</p>
                    </div>
                </div>
                <div className={`${styles.score} ${styles.homeCol}`}>
                    <p className={styles.text}>{score[0]}</p>
                </div>
                <div className={styles.icon}>
                    <img src={homeMapStates[mapState]} alt=""/>
                </div>
            </div>

            <div className={`${styles.team} ${styles.flip}`}>
                <div className={styles.logo }>
                    <img className={`${styles.img} ${styles.flip}`} src={`data:image/png;base64, ${images[1]}`} alt={match.away.name[0]}/>
                </div>
                <div className={`${styles.teamName} ${styles.flip}`}>
                    <div className={styles.backgroundImg}>
                        <img className={styles.transImg} src={`data:image/png;base64, ${images[1]}`} alt={""}/>
                    </div>
                    <div className={styles.textOnTop}>
                        <p className={styles.text}>{match.away.name}</p>
                    </div>
                </div>
                <div className={`${styles.score} ${styles.awayCol}`}>
                    <p className={`${styles.text} ${styles.flip}`}>{score[1]}</p>
                </div>
                <div className={styles.icon}>
                    <img className={styles.img} src={awayMapStates[mapState]} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard;