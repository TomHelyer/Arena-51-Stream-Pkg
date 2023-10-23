import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { io } from "socket.io-client";
import { main } from "../../Media/Scenes";
import mapLookupAdvanced from "../../Media/Images/Maps";

const demoMatch: MatchObject = {
  id: "demoID",
  home: {
    id: 123,
    name: "Power Corgis",
    rank: "Bronze",
  },
  away: {
    id: 456,
    name: "PlatPack",
    rank: "Silver",
  },
  scoreboard: {
    maps: [
      {
        name: "Busan",
        score: [1, 2],
        isCompleted: true,
      },
      {
        name: "Route66",
        score: [3, 0],
        isCompleted: true,
      },
      {
        name: "Hollywood",
        score: [0, 0],
        isCompleted: false,
      },
    ],
    isFlipped: false,
  },
  leagueId: "123",
};

const apiUrl = process.env.REACT_APP_API || "http://localhost:8081";

const createStyles = createUseStyles({
  cont: {
    aspectRatio: "16/9",
    position: "relative",
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
    paddingTop: "8%",
    paddingBottom: "3%",
  },
  mapContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "85%",
    background: "black",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexGrow: "1",
    marginTop: "1%",
    marginBottom: "1%",
    overflow: "hidden",
    position: "relative",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  mapContainerNotPlayed: {
    display: "flex",
    width: "85%",
    background: "#141414",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    flexGrow: "1",
    marginTop: "1%",
    marginBottom: "1%",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  },
  mapContainerActive: {
    display: "flex",
    justifyContent: "space-between",
    width: "85%",
    background: "white",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexGrow: "1.6",
    marginTop: "1%",
    marginBottom: "1%",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  mapContainerActiveNotStarted: {
    display: "flex",
    justifyContent: "center",
    width: "85%",
    background: "white",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexGrow: "1.6",
    marginTop: "1%",
    marginBottom: "1%",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  gamemode: {
    display: "flex",
    aspectRatio: "1",
    height: "100%",
    background: "#00ADE1",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "50%",
      height: "50%",
      objectFit: "contain",
    },
  },
  gamemodeActive: {
    display: "flex",
    aspectRatio: "1/1.6",
    height: "100%",
    background: "#00ADE1",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "50%",
      height: "50%",
      objectFit: "contain",
    },
  },
  gamemodeName: {
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "black",
    position: "absolute",
    bottom: "1rem",
    textAlign: "center",
  },
  logo: {
    display: "flex",
    aspectRatio: "1",
    height: "70%",
    alignSelf: "center",
  },
  score: {
    display: "flex",
    aspectRatio: "1",
    background: "white",
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "#676767",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  scoreActive: {
    display: "flex",
    aspectRatio: "1/1.6",
    background: "white",
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "#676767",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  boldScore: {
    color: "#000000",
  },
  mapTitleActive: {
    aspectRatio: "1",
    height: "90%",
    alignSelf: "center",
    background: "orange",
    marginLeft: "auto",
    marginRight: "auto",
  },
  containerNextMap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  nextMap: {
    fontFamily: "Inter",
    fontSize: "2em",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "2px 2px 4px #FFFFFF",
  },
  mapName: {
    fontFamily: "Inter",
    fontSize: "5em",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: "6px 6px 7px #FFFFFF",
  },
  overlayForFinishedMaps: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    overflow: "hidden",
  },
});

const MapOverview = () => {
  const styles = createStyles();
  const [mapAdvanced, setMapAdvanced] = useState("");
  const [logo, setLogo] = useState(["", ""]);
  const [match, setMatch] = useState<MatchInfoObject>({
    home: {
      name: "home",
      rank: "Bronze",
    },
    away: {
      name: "away",
      rank: "Bronze",
    },
  });

  let totalMaps: number = demoMatch.scoreboard.maps.length;
  let dynamicHeightActive: string;
  let dynamicHeightInactive: string;
  let dynamicFontSizeScore: string;
  let dynamicFontSizeGamemodeName: string;
  let dynamicAspectRatio: string;

  let lastCompletedIndex = -1;
  const divs = demoMatch.scoreboard.maps.map((map, index) => {
    const getMapImagePath = (mapName: string) => {
      for (const category in mapLookupAdvanced) {
        if (mapLookupAdvanced[category as keyof MapLookup][mapName]) {
          return mapLookupAdvanced[category as keyof MapLookup][mapName];
        }
      }
      return "ERROR";
    };

    if (totalMaps === 3) {
      dynamicHeightActive = "38%";
      dynamicHeightInactive = "28%";
      dynamicFontSizeScore = "6em";
      dynamicFontSizeGamemodeName = "1.5em";
      dynamicAspectRatio = "1/1.358";
    } else if (totalMaps === 4) {
      dynamicHeightActive = "28%";
      dynamicHeightInactive = "21%";
      dynamicFontSizeScore = "6em";
      dynamicFontSizeGamemodeName = "1.25em";
      dynamicAspectRatio = "1/1.33";
    } else if (totalMaps === 5) {
      dynamicHeightActive = "22%";
      dynamicHeightInactive = "17%";
      dynamicFontSizeScore = "4.5em";
      dynamicFontSizeGamemodeName = "1em";
      dynamicAspectRatio = "1/1.3";
    }

    const getCategory = (mapName: string) => {
      for (const category in mapLookupAdvanced) {
        if (mapLookupAdvanced[category as keyof MapLookup][mapName]) {
          return category;
        }
      }
      return "ERROR";
    };

    let mapContainerStyle;
    let scoreContainerStyle;
    let gamemodeContainerStyle;
    let mapHasStarted: boolean;

    if (!map.isCompleted && map.score[0] === 0 && map.score[1] === 0) {
      mapHasStarted = false;
    } else {
      mapHasStarted = true;
    }

    if (map.isCompleted) {
      mapContainerStyle = styles.mapContainer;
      lastCompletedIndex = index;
      scoreContainerStyle = styles.score;
      gamemodeContainerStyle = styles.gamemode;
    } else if (
      !map.isCompleted &&
      mapHasStarted === false &&
      lastCompletedIndex === index - 1
    ) {
      mapContainerStyle = styles.mapContainerActiveNotStarted;
    } else if (!map.isCompleted && lastCompletedIndex === index - 1) {
      mapContainerStyle = styles.mapContainerActive;
      scoreContainerStyle = styles.scoreActive;
      gamemodeContainerStyle = styles.gamemodeActive;
    } else {
      mapContainerStyle = styles.mapContainerNotPlayed;
      gamemodeContainerStyle = styles.gamemode;
    }

    return (
      <div
        key={index}
        className={mapContainerStyle}
        style={{
          backgroundImage: `url(${getMapImagePath(map.name)})`,
          position: "relative",
          height:
            mapContainerStyle === styles.mapContainerActive ||
            mapContainerStyle === styles.mapContainerActiveNotStarted
              ? dynamicHeightActive
              : dynamicHeightInactive,
        }}
      >
        {mapHasStarted === true && (
          <div
            className={gamemodeContainerStyle}
            style={{
              fontSize: dynamicFontSizeGamemodeName,
              aspectRatio:
                mapContainerStyle === styles.mapContainerActive ||
                mapContainerStyle === styles.mapContainerActiveNotStarted
                  ? dynamicAspectRatio
                  : "",
            }}
          >
            <img
              src={getMapImagePath(getCategory(map.name))}
              alt=""
              style={{ filter: "invert(100%)" }} // TODO: For some reason the filter: invert css style doesnt work if it is in the css class, but only if the images are svg. Maybe someone knows a fix?
            />
            <span className={styles.gamemodeName}>{map.name}</span>
          </div>
        )}
        {map.isCompleted && map.score[0] !== map.score[1] && (
          <div className={styles.logo}>
            <img
              src={`data:image/png;base64, ${
                map.score[0] > map.score[1] ? logo[0] : logo[1]
              }`}
              alt={demoMatch.away.name[1]}
            />
          </div>
        )}
        {mapContainerStyle === styles.mapContainerActiveNotStarted && (
          <div className={styles.containerNextMap}>
            <span className={styles.nextMap}>Next Map</span>
            <span className={styles.mapName}>{map.name}</span>
          </div>
        )}
        {mapHasStarted === true && (
          <div
            className={scoreContainerStyle}
            style={{
              fontSize: dynamicFontSizeScore,
              aspectRatio:
                mapContainerStyle === styles.mapContainerActive ||
                mapContainerStyle === styles.mapContainerActiveNotStarted
                  ? dynamicAspectRatio
                  : "",
            }}
          >
            <span
              className={
                map.isCompleted && map.score[0] > map.score[1]
                  ? styles.boldScore
                  : ""
              }
            >
              {map.score[0]}
            </span>
            -
            <span
              className={
                map.isCompleted && map.score[1] > map.score[0]
                  ? styles.boldScore
                  : ""
              }
            >
              {map.score[1]}
            </span>
          </div>
        )}
      </div>
    );
  });

  useEffect(() => {
    fetch(`${apiUrl}/mapoverview`)
      .then((res) => {
        res
          .json()
          .then((value) => {
            setMapAdvanced(value.mapAdvanced as string);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    Promise.all([
      fetch(`${apiUrl}/image/team/${demoMatch.home.name}`).then((res) => {
        if (res.status === 200) return res.json().then((val) => val.image);

        console.log("Error code: ", res.status);
        return;
      }),
      fetch(`${apiUrl}/image/team/${demoMatch.away.name}`).then((res) => {
        if (res.status === 200) return res.json().then((val) => val.image);

        console.log("Error code: ", res.status);
        return;
      }),
    ]).then((val) => {
      setLogo(val);
    });

    const socket = io(apiUrl);

    socket.on("mapoverview", (mapAdvanced) => {
      setMapAdvanced(mapAdvanced);
    });
  }, [match]);

  return (
    <div className={styles.cont}>
      <video className={styles.background} loop autoPlay src={main} />
      <div className={styles.mapContainerContainer}>{divs}</div>
    </div>
  );
};

export default MapOverview;
