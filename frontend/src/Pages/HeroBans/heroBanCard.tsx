import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main } from '../../Media/Scenes';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
    cardCont: {
        position: "relative",
        aspectRatio: "0.79",
        width: "20%",
        height: "auto",
        margin: "2%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
    },
    img: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
    },
    ban: {
        position: "absolute",
        top: "0",
        left: "-1%",
        width: "102%",
        aspectRatio: "1",
        opacity: "0.65",
        backgroundColor: "white",
    }
});

const HeroBanCard = ({hero, banBy=undefined}: HeroBanCardProps) => {
    const styles = createStyles();

    return (
        <div className={styles.cardCont}>
            <img className={styles.img} src={hero} alt={""}/>
            {banBy&&<img className={styles.ban} src={`data:image/png;base64, ${banBy}`} alt={""}/>}
        </div>
    )
}

type HeroBanCardProps = {
    hero: any;
    banBy?: any;
}

export default HeroBanCard;