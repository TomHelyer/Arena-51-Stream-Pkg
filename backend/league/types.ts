export enum result{
    Home = 1,
    Draw = 0,
    Away = -1,
}

export enum matchStopType{
    BestOf,
    FirstTo,
    NumMaps,
}

export type leagueInfoObject = {
    teams: teamInfoObject[],
    matches: matchInfoObject[],
    table: tableInfoObject,
    isComplete?: boolean,
}

export type tableInfoObject = tableRowInfoObject[]

export type tableRowInfoObject = {
    team: number,
    points: number,
    mapDiff: number,
    matchesPlayed: number,
    w: number,
    l: number,
    d: number,
    live?: boolean
}

export type matchInfoObject = {
    home: number,
    away: number,
    week: number,
    score: scoreInfoObject,
    stopCondition: stopCondition,
    result?: result
    live?: boolean
}

export type stopCondition = {
    type: matchStopType,
    value: number
}

export type scoreInfoObject = {
    home: number,
    away: number,
    mapsPlayed: number,
}

export type teamInfoObject = {
    name: string,
    sr: number,
}
