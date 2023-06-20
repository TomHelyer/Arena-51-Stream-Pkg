import { Routes, Route, BrowserRouter } from "react-router-dom";
import NextMap from "./Pages/NextMap";
import Control from "./Pages/Control";
import './App.css';
import 'remixicon/fonts/remixicon.css';
import { createUseStyles } from "react-jss";
import CasterCams from "./Pages/CasterCams";
import Scoreboard from "./Pages/Scoreboard";

const createStyles = createUseStyles({
  nextmap: {
    width: "1920px",
    height: "1080px",
    position: "absolute"
  }
});

const App = () => {
  const styles = createStyles();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Control />}/>
          <Route path="nextmap" element={
            <div className={styles.nextmap}>
              <NextMap/>
            </div>
          } />
          <Route path="castercams" element={
            <div className={styles.nextmap}>
              <CasterCams/>
            </div>
          } />
          <Route path="scoreboard" element={
            <div className={styles.nextmap} >
              <Scoreboard />
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
