import {createUseStyles} from 'react-jss';

const createStyles = createUseStyles({
    cardCont: {
        position: "relative",
        aspectRatio: "0.79",
        height: "22%",
        borderRadius: "4px",
        border: "0.2em white solid",
        margin: "0.2em",
        display: "flex",
        alignItems: "center",
    },
    img: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%"
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
        backgroundColor: "white",
        opacity: '0.7',
    },
    ban: {
        width: "100%",
        aspectRatio: "1",
        opacity: "1",
    }
});

const HeroBanCard = ({hero, banBy=undefined}: HeroBanCardProps) => {
    const styles = createStyles();

    return (
        <div className={styles.cardCont}>
            <img className={styles.img} src={hero} alt={""}/>
            
            {banBy &&
                <div className={styles.banCont}>
                    <img className={styles.ban} src={`data:image/png;base64, ${banBy}`} alt={""}/>
                </div>
            }
        </div>
    )
}

type HeroBanCardProps = {
    hero: any;
    banBy?: any;
}

export default HeroBanCard;