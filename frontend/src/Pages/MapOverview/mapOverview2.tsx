import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { io } from "socket.io-client";
import { main } from "../../Media/Scenes";
import mapLookupAdvanced from "../../Media/Images/Maps";
import PlayedMapCard from "./playedMapCard";

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
        name: "Route66",
        score: [1, 2],
        isCompleted: true,
      },
      {
        name: "Hollywood",
        score: [1, 2],
        isCompleted: true,
      },
      {
        name: "Suravasa",
        score: [0, 0],
        isCompleted: false,
        isHomeAttacking: true,
      },
      {
        name: "push",
        score: [0, 0],
        isCompleted: false,
      },
    ],
    isFlipped: false,
  },
  leagueId: "123",
};

const createStyles = createUseStyles({
  cont: {
    aspectRatio: "16/9",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
  },
});

const MapOverview = ({ match = demoMatch }: MapOverviewProps) => {
  const styles = createStyles();
  const { maps } = match.scoreboard;

  return (
    <div className={styles.cont}>
      {maps.map((value: ScoreBoardMapObject) => {
        return (
          <PlayedMapCard
            score={value.score}
            mapActive={!value.isCompleted}
            mapName={value.name}
          />
        );
      })}
    </div>
  );
};

type MapOverviewProps = {
  match?: MatchObject;
};

export default MapOverview;
