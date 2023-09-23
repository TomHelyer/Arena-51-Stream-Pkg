import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { io } from "socket.io-client";
import { main } from "../../Media/Scenes";
import mapLookupAdvanced from "../../Media/Images/Maps";

const demoMatch: MatchObject = {
  id: "demoID",
  home: {
    id: 123,
    name: "Hjönk Attack",
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
        name: "Eichenwalde",
        score: [2, 0],
        isCompleted: false,
        isHomeAttacking: true,
      },
      {
        name: "Dorado",
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
    paddingTop: "9.5%",
    paddingBottom: "3%",
  },
  mapContainer: {
    display: "flex",
    justifyContent: "space-between",
    maxHeight: "30%",
    width: "80%",
    background: "black",
    flexGrow: "1",
    marginTop: "1.5%",
    marginBottom: "1.5%",
    overflow: "hidden",
    position: "relative",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: "40%",
    },
  },
  mapContainerNotPlayed: {
    display: "flex",
    maxHeight: "30%",
    width: "80%",
    background: "white",
    flexGrow: "1",
    marginTop: "1.5%",
    marginBottom: "1.5%",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  mapContainerActive: {
    display: "flex",
    justifyContent: "space-between",
    maxHeight: "40%",
    width: "80%",
    background: "white",
    flexGrow: "1.6",
    marginTop: "1.5%",
    marginBottom: "1.5%",
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
    aspectRatio: "1",
    height: "100%",
    background: "green",
    fontSize: "9em",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreActive: {
    display: "flex",
    aspectRatio: "1/1.6",
    height: "100%",
    background: "green",
    fontSize: "9em",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  boldScore: {
    fontWeight: "bold",
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
  },
});

const MapOverview = () => {
  const styles = createStyles();
  const [mapAdvanced, setMapAdvanced] = useState("");
  const [images, setImages] = useState(["", ""]);
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

    // fix tomorrow
    const getGamemodeImagePath = (mapName: string) => {
      for (const category in mapLookupAdvanced) {
        if (mapLookupAdvanced[category as keyof MapLookup][mapName]) {
          return mapLookupAdvanced[category as keyof MapLookup];
        }
      }
      return "ERROR";
    };

    let mapContainerStyle;
    let scoreContainerStyle;
    let gamemodeContainerStyle;

    if (map.isCompleted) {
      mapContainerStyle = styles.mapContainer;
      lastCompletedIndex = index;
      scoreContainerStyle = styles.score;
      gamemodeContainerStyle = styles.gamemode;
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
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={gamemodeContainerStyle}></div>
        {map.isCompleted && (
          <div className={styles.logo}>this is a team logo</div>
        )}
        {mapContainerStyle !== styles.mapContainerNotPlayed && (
          <div className={scoreContainerStyle}>
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
      fetch(`${apiUrl}/image/team/${match.home.name}`).then((res) => {
        if (res.status === 200) return res.json().then((val) => val.image);

        console.log("Error code: ", res.status);
        return;
      }),
      fetch(`${apiUrl}/image/team/${match.away.name}`).then((res) => {
        if (res.status === 200) return res.json().then((val) => val.image);

        console.log("Error code: ", res.status);
        return;
      }),
    ]).then((val) => {
      setImages(val);
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
