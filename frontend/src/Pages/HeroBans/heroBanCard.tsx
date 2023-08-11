import {createUseStyles} from 'react-jss';

const createStyles = createUseStyles({
    cardCont: {
        position: "relative",
        aspectRatio: "0.79",
        height: "22%",
        borderRadius: "0.3em",
        border: "0.2em white solid",
        margin: "0.2em",
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
    },
    img: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        borderRadius: "0.1em",
    },
    banCont:{
        position: "absolute",
        top: "0",
        height: "100%",
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        overflow: 'hidden',
        borderRadius: "0.1em",
    },
    ban: {
        width: "100%",
        aspectRatio: "1",
        opacity: "1",
    },
    banned:{
        opacity: "0.4"
    },
    newBan: {
        //borderColor: "#d63750",
        backgroundColor: "#d63750",
    }
});

const HeroBanCard = ({hero, banBy=undefined, newBan=false}: HeroBanCardProps) => {
    const styles = createStyles();

    return (
        <div className={`${styles.cardCont} ${newBan? styles.newBan : ""}`}>
            <img className={`${styles.img} ${banBy? styles.banned:""}`} src={hero} alt={""}/>
            
            {banBy &&
                <div className={`${styles.banCont}`}>
                    <img className={styles.ban} src={`data:image/png;base64, ${banBy}`} alt={""}/>
                </div>
            }
        </div>
    )
}

type HeroBanCardProps = {
    hero: string;
    banBy?: any;
    newBan?: boolean
}

export default HeroBanCard;