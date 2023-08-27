import {createUseStyles} from 'react-jss';
import { main } from '../../Media/Scenes';

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
        objectFit: "fill"
    },
});


const MapOverview = () => {
    const styles = createStyles();


    return (
        <div className={styles.cont}>
            <video className={styles.background} loop autoPlay src={main}/>

        </div>
    )
}

export default MapOverview;