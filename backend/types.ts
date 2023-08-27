export enum MapState{
    Con=0,
    Home=1,
    Away=2,
}

export type CasterObject = {
    name: string,
    vdo?: string
}

export type StateObject = {
    casters: CastersObject,
    nextMap: string,
    scoreboard: ScoreboardObject,
    heroBans: HeroBansObject
}

export type HeroBansObject = {
    home: string[],
    away: string[]
}

export type ScoreboardObject = {
    score: ScoreObject,
    match: ScoreboardInfoObject,
    mapState: MapState,
    flip: boolean
}

export type StatsObject = {
    points?: number,
    winLossDraw?: number[],
    mapDiff?: number,
}

export type ScoreboardInfoObject = {
    home: TeamObject,
    away: TeamObject,
    stats?: StatsObject[],
}

export type CastersObject = CasterObject[]

export type ScoreObject = number[];

export type TeamObject = {
    name: string,
    rank: "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum" | "Master" | "Grand Master" | "Top 500",
}

export enum Result{
    Home = 1,
    Draw = 0,
    Away = -1,
}

export enum MatchStopType{
    BestOf,
    FirstTo,
    NumMaps,
}

export type LeagueInfoObject = {
    teams: TeamInfoObject[],
    matches: MatchInfoObject[],
    table: TableInfoObject,
    isComplete?: boolean,
}

export type TableInfoObject = TableRowInfoObject[]

export type TableRowInfoObject = {
    team: number,
    points: number,
    mapDiff: number,
    matchesPlayed: number,
    w: number,
    l: number,
    d: number,
    live?: boolean
}

export type MatchInfoObject = {
    home: number,
    away: number,
    week: number,
    score: ScoreInfoObject,
    stopCondition: StopCondition,
    result?: Result
    live?: boolean
}

export type StopCondition = {
    type: MatchStopType,
    value: number
}

export type ScoreInfoObject = {
    home: number,
    away: number,
    mapsPlayed: number,
}

export type TeamInfoObject = {
    name: string,
    sr: number,
}
