import { createUseStyles } from "react-jss";
import mapLookupAdvanced from "../../Media/Images/Maps";

const createStyles = createUseStyles({
  card: {
    height: "100%",
    width: "100%",
  },
  cardSectionContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    fontSize: "100%",
    justifyContent: "space-between",
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "#676767",
  },
  imageContainer: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyItems: "center",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  cardSection: {
    aspectRatio: "1",
    height: "100%",
    fontSize: "100%",
  },
  boldScore: {
    color: "#000000",
  },
  coverInactive: {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

const getGamemode = (mapName: string) => {
  for (const category in mapLookupAdvanced) {
    if (mapLookupAdvanced[category as keyof MapLookup][mapName]) {
      return mapLookupAdvanced[category as keyof MapLookup][category];
    }
  }
  return "ERROR";
};

const getMapImagePath = (mapName: string) => {
  for (const category in mapLookupAdvanced) {
    if (mapLookupAdvanced[category as keyof MapLookup][mapName]) {
      return mapLookupAdvanced[category as keyof MapLookup][mapName];
    }
  }
  return "ERROR";
};

const PlayedMapCard = ({
  score,
  mapActive = false,
  mapName,
}: PlayedMapCardProps) => {
  const styles = createStyles();

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={getMapImagePath(mapName)} alt="" />
        {!mapActive && <div className={styles.coverInactive}></div>}
      </div>
      <div className={styles.cardSectionContainer}>
        <div className={styles.cardSection}>
          <img src={getGamemode(mapName)} alt="" />
        </div>
        {!mapActive && <div className={styles.cardSection}>Logo</div>}
        <div className={styles.cardSection}>
          <div
            className={
              !mapActive && score[0] > score[1] ? styles.boldScore : ""
            }
          >
            {score[0]}
          </div>
          <div>-</div>
          <div
            className={
              !mapActive && score[1] > score[0] ? styles.boldScore : ""
            }
          >
            {score[1]}
          </div>
        </div>
      </div>
    </div>
  );
};

type PlayedMapCardProps = {
  score: ScoreObject;
  mapActive: boolean;
  mapName: string;
};

export default PlayedMapCard;
