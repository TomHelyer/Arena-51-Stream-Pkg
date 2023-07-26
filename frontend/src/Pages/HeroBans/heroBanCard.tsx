import { useEffect, useState } from 'react';
import {createUseStyles} from 'react-jss';
import { io } from 'socket.io-client';
import { main } from '../../Media/Scenes';

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
    cardCont: {
        height: "99%",
        backgroundColor: 'white',
        flexGrow: 1,
        margin: "0.5%",
    }
});

const HeroBanCard = ({hero}: HeroBanCardProps) => {
    const styles = createStyles();

    return (
        <div className={styles.cardCont}>
        </div>
    )
}

type HeroBanCardProps = {
    hero: string;
}

export default HeroBanCard;