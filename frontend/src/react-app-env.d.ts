/// <reference types="react-scripts" />

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.webm' {
    const src: string;
    export default src;
}

enum matchStates{
    Home = 1,
    Away = -1,
    Draw = 0,
    NoResult = ""
}

type ScorebaordObject = {
    match: MatchInfoObject,
    score: number[],
}

type CasterObject = {
    name: string,
    vdo?: string,
}

type CastersObject = CasterObject[]

type MatchInfoObject = {
    home: TeamObject,
    away: TeamObject,
    state: matchStates
}

type TeamObject = {
    name: string,
    sr: number,
}