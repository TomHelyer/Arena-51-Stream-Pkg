import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { main } from '../../Media/Scenes';
import mapLookupAdvanced from '../../Media/Images/Maps';

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
        objectFit: "fill",
    },
    mapContainerContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "87.5%",
        paddingTop: "9.5%",
        paddingBottom: "3%",
    },
    mapContainer: {
        display: "flex",
        justifyContent: "space-between",
        maxHeight: "30%",
        width: "80%",
        background: "white",
        flexGrow: "1",
        marginTop: "1.5%",
        marginBottom: "1.5%",
    },
    mapContainerNotPlayed: {
        display: "flex",
        maxHeight: "30%",
        width: "80%",
        background: "white",
        flexGrow: "1",
        marginTop: "1.5%",
        marginBottom: "1.5%",
    },
    mapContainerActive: {
        display: "flex",
        maxHeight: "40%",
        width: "80%",
        background: "white",
        flexGrow: "1.6",
        marginTop: "1.5%",
        marginBottom: "1.5%",
    },
    gamemode: {
        display: "flex",
        aspectRatio: "1",
        height: "100%",
        background: "red",
    },
    gamemodeActive: {
        display: "flex",
        aspectRatio: "1/1.6",
        height: "100%",
        background: "red",
    },
    logo: {
        display: "flex",
        aspectRatio: "1",
        height: "90%",
        alignSelf: "center",
        background: "yellow",
    },
    score: {
        display: "flex",
        justifySelf: "flex-end",
        aspectRatio: "1",
        height: "100%",
        background: "green",
    },
    mapTitleActive: {
        aspectRatio: "1",
        height: "90%",
        alignSelf: "center",
        background: "orange",
        marginLeft: "auto",
        marginRight: "auto",
    },
    placeholder: {
        display: "flex",
        justifySelf: "flex-end",
        aspectRatio: "1/1.6",
        height: "100%",
    }
});



const MapOverview = () => {
    const styles = createStyles();
    const [map, setMap] = useState("");
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
        fetch(`${apiUrl}/mapoverview`).then(res => {
            res.json().then(value => {
                setMap(value.map as string);
            })
            .catch (err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
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
            <div className={styles.mapContainerContainer}>
                <div className={styles.mapContainer}>
                    {map}
                
                    <div className={styles.gamemode}>
                    </div>

                    <div className={styles.logo}>
                    </div>

                    <div className={styles.score}>
                    </div>

                </div>
                <div className={styles.mapContainer}>
                
                    <div className={styles.gamemode}>
                    </div>

                    <div className={styles.logo}>
                    </div>

                    <div className={styles.score}>
                    </div>

                </div>
                <div className={styles.mapContainer}>
                    
                    <div className={styles.gamemode}>
                    </div>

                    <div className={styles.logo}>
                    </div>

                    <div className={styles.score}>
                    </div>

                </div>
                <div className={styles.mapContainerActive}>
                    
                    <div className={styles.gamemodeActive}>
                    </div>

                    <div className={styles.mapTitleActive}>
                    </div>

                    <div className={styles.placeholder}>
                    </div>

                </div>
                <div className={styles.mapContainerNotPlayed}>
                    <div className={styles.gamemode}>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MapOverview;