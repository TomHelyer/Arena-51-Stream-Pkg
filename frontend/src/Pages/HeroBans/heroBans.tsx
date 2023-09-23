import {createUseStyles} from 'react-jss';
import { main } from '../../Media/Scenes';
import HeroBanCard from './heroBanCard';
import heroLookup from '../../Media/HeroesIcons';
import { HeroBansObject } from '../../../../types';

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
        top: "10%",
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

type HeroBansProps = {
    images: string[],
    heroBans: HeroBansObject,
}

const HeroBans = ({images, heroBans}: HeroBansProps) => {
    const styles = createStyles();

    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>
            <div className={styles.heroContainerContainer}>
                <div className={styles.heroContainer}>
                    {Object.keys(heroLookup.tank).map((key, idx) => {
                        const img = heroLookup.tank[key];
                        let bannedBy = undefined;
                        let newBan = false;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                            newBan = heroBans.away[heroBans.away.length-1] === key || heroBans.home[heroBans.home.length-1] === key
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy} newBan={newBan}/>
                    })}
                </div>
                <div className={styles.dpsContainer}>
                    {Object.keys(heroLookup.dps).map((key, idx) => {
                        const img = heroLookup.dps[key];
                        let bannedBy = undefined;
                        let newBan = false;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                            newBan = heroBans.away[heroBans.away.length-1] === key || heroBans.home[heroBans.home.length-1] === key
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy} newBan={newBan}/>
                    })}
                </div>
                <div className={styles.heroContainer}>
                {Object.keys(heroLookup.support).map((key, idx) => {
                        const img = heroLookup.support[key];
                        let bannedBy = undefined;
                        let newBan = false;
                        if(heroBans){
                            if (!heroBans.home.every(value => value!==key))
                                bannedBy = images[0];
                            if (!heroBans.away.every(value => value!==key))
                                bannedBy = images[1];
                            newBan = heroBans.away[heroBans.away.length-1] === key || heroBans.home[heroBans.home.length-1] === key
                        }
                        return <HeroBanCard hero={img} key={idx} banBy={bannedBy} newBan={newBan}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default HeroBans;