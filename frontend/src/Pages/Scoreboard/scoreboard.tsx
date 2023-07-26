import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import push from '../../Media/Images/arrow-right-fill.svg';
import def from '../../Media/Images/shield-fill.svg';
import att from '../../Media/Images/sword-fill.svg';
import { io } from 'socket.io-client';

const image = require('../../Media/Images/Capture.PNG');

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const homeMapStates = [push, att, def];
const awayMapStates = [push, def, att];

const createStyles = createUseStyles({
    demoImg: {
        backgroundImage: `url(${image})`,
    },
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
        opacity: "0.2",
        width: "70%",
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
        flexGrow: 1,
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

const Scoreboard = ({displayDemo = false}: {displayDemo?: boolean}) => {
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
    const [score, setScore] = useState([0,0,0]);
    const [mapState, setMapState] = useState<mapState>(0);
    const [flip, setFlip] = useState<boolean>(false);

    useEffect(() => {
        fetch(`${apiUrl}/scoreboard`).then(res => res.json().then((val: ScorebaordObject) => {

            setMatch(val.match);
            setScore(val.score);
            setMapState(val.mapState);
            setFlip(val.flip);
        }));

        const socket = io(apiUrl);

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
        <div className={`${styles.frame} ${flip? styles.flip : ""} ${displayDemo? styles.demoImg : ""}`}>
            <div className={`${styles.team}`}>
                <div className={`${styles.logo} ${flip? styles.flip : ""}`}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[0]}`} alt={match.home.name[0]}/>
                </div>
                <div className={`${styles.teamName} ${flip? styles.flip : ""}`}>
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

            <div className={`${styles.team} ${styles.flip}`}>
                <div className={`${styles.logo} ${flip? "" : styles.flip}`}>
                    <img className={styles.img} src={`data:image/png;base64, ${images[1]}`} alt={match.away.name[0]}/>
                </div>
                <div className={`${styles.teamName} ${flip? "" : styles.flip}`}>
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
            {flip}
        </div>
        
    )
}

export default Scoreboard;