import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import push from './arrow-right-fill.svg';
import def from './shield-fill.svg';
import att from './sword-fill.svg';
import { io } from 'socket.io-client';

// const T500 = require('../../Media/Images/1.Grandmaster/Grandmaster 1.png');
// const GM = require('../../Media/Images/1.Grandmaster/Grandmaster 1 No Shine.png');
// const Master = require('../../Media/Images/2.Masters/Masters 1 No Shine.png');
// const Diamond = require('../../Media/Images/3.Diamond/Diamond 1.png');
// const Plat = require("../../Media/Images/4.Platinum/Platinum 1.png");
// const Gold = require("../../Media/Images/5.Gold/Gold 1.png");
// const Silver = require("../../Media/Images/6.Silver/Silver 1.png");
// const Bronze = require("../../Media/Images/7.Bronze/Bronze 1.png"); 

const image = require('./Capture.PNG');

const homeMapStates = [push, att, def];
const awayMapStates = [push, def, att];
// const colorMap: (rank: string) => string = (rank) => {
//     return (
//         rank === "Top 500"? T500 :
//         rank === "Grand Master"? GM :
//         rank === "Master"? Master :
//         rank === "Diamond"? Diamond :
//         rank === "Platinum"? Plat :
//         rank === "Gold"? Gold :
//         rank === "Silver"? Silver :
//         rank === "Bronze"? Bronze :
//         ""
//     )
// }
//d63750
//2fbbde

const createStyles = createUseStyles({
    frame: {
        fontFamily: "Infinity",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        fontSize: "140%",
        textAlign: "center",
        justifyContent: "space-between",
        aspectRatio: `${1920/1080}`,
        //backgroundImage: `url(${image})`, //uncomment this line for testing purposes
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
        backgroundColor: 'white',
    },
    away: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        width: "30%",
        height: "3.5%",
    },
    logo:{
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
        minWidth: 0,
    },
    textOnTop: {
        position: "relative",
        top: "-100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    rankCont:{
        height: "100%",
        aspectRatio: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    rank: {
        height: "170%",
        aspectRatio: 1,
    },
    score: {
        height: "100%",
        aspectRatio: 1,
        fontSize: "110%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: "100%",
        aspectRatio: 1,
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
            rank: "Bronze",
        },
        away: {
            name: "away",
            rank: "Bronze",
        }
    });
    const [score, setScore] = useState([0,0]);
    const [mapState, setMapState] = useState<mapState>(0);
    const [flip, setFlip] = useState<boolean>(false);

    useEffect(() => {
        fetch('http://localhost:8080/scoreboard').then(res => res.json().then((val: ScorebaordObject) => {
            setMatch(val.match);
            setScore(val.score);
            setMapState(val.mapState);
            setFlip(val.flip);
        }));

        const socket = io('http://localhost:8080');

        socket.on('scoreboard:score', (val) => {
            setScore(val.score);
        });

        socket.on('scoreboard:match', val => {
            setMatch(val.match);
        });

        socket.on('scoreboard:mapState', (val) => {
            setMapState(val.mapState);
        });
        
        socket.on('scoreboard:flip', (val) => {
            setFlip(val.flip);
        });

    }, []);

    useEffect(() => {},[flip]);

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
        <div className={`${styles.frame} ${flip? styles.flip : ""}`}>
            <div className={`${styles.team} ${flip? styles.flip : ""}`}>
                <div className={`${styles.logo} `}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[0]}`} alt={match.home.name[0]}/>
                </div>
                <div className={`${styles.teamName}`}>
                    <div className={styles.backgroundImg}>
                        <img className={styles.transImg} src={`data:image/png;base64, ${images[0]}`} alt={""}/>
                    </div>
                    <div className={styles.textOnTop}>
                        <p className={styles.text}>{match.home.name}</p>
                    </div>
                </div>
                <div className={`${styles.score} ${flip? styles.awayCol : styles.homeCol}`}>
                    <p className={styles.text}>{score[0]}</p>
                </div>
                <div className={`${styles.icon} ${flip? styles.flip : ""}`}>
                    <img src={homeMapStates[mapState]} alt=""/>
                </div>
            </div>

            <div className={`${styles.team} ${flip? "" : styles.flip}`}>
                <div className={`${styles.logo} ${styles.flip}`}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[1]}`} alt={match.away.name[0]}/>
                </div>
                <div className={`${styles.teamName} ${styles.flip}`}>
                    <div className={styles.backgroundImg}>
                        <img className={styles.transImg} src={`data:image/png;base64, ${images[1]}`} alt={""}/>
                    </div>
                    <div className={styles.textOnTop}>
                        <p className={styles.text}>{match.away.name}</p>
                    </div>
                </div>
                <div className={`${styles.score} ${flip? styles.homeCol : styles.awayCol} ${styles.flip}`}>
                    <p className={`${styles.text}`}>{score[1]}</p>
                </div>
                <div className={styles.icon}>
                    <img className={styles.img} src={awayMapStates[mapState]} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default Scoreboard;