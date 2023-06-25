/// <reference types="react-scripts" />

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.webm' {
    const src: string;
    export default src;
}

enum result{
    Home = 1,
    Draw = 0,
    Away = -1,
}

enum matchStopType{
    BestOf,
    FirstTo,
    NumMaps,
}

enum mapState{
    Con=0,
    Home=1,
    Away=2,
}

type ScorebaordObject = {
    flip: boolean,
    score: ScoreObject,
    match: MatchInfoObject,
    mapState: mapState,
}

type ScoreObject = number[];

type CasterObject = {
    name: string,
    vdo?: string,
}

type CastersObject = CasterObject[]

type MatchInfoObject = {
    home: TeamObject,
    away: TeamObject,
    stats?: statsObject[]
}

type TeamObject = {
    id?: number,
    name: string,
    rank: Rank,
}

type Rank = "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum" | "Master" | "Grand Master" | "Top 500";

type StatsObject = {
    points?: number,
    winLossDraw?: number[],
    mapDiff?: number,
}

type newTeam = {
    name: string,
    file?: File,
    target?: any,
}