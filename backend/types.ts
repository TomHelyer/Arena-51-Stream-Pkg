enum MapState{
    Con=0,
    Home=1,
    Away=2,
}

type CasterObject = {
    name: string,
    vdo?: string
}

type StateObject = {
    casters: CastersObject,
    nextMap: string,
    scoreboard: ScoreboardObject,
    heroBans: HeroBansObject
}

type HeroBansObject = {
    home: string[],
    away: string[]
}

type ScoreboardObject = {
    score: ScoreObject,
    match: ScoreboardInfoObject,
    mapState: MapState,
    flip: boolean
}

type StatsObject = {
    points?: number,
    winLossDraw?: number[],
    mapDiff?: number,
}

type ScoreboardInfoObject = {
    home: TeamObject,
    away: TeamObject,
    stats?: StatsObject[],
}

type CastersObject = CasterObject[]

type ScoreObject = number[];

type TeamObject = {
    name: string,
    rank: "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum" | "Master" | "Grand Master" | "Top 500",
}

enum Result{
    Home = 1,
    Draw = 0,
    Away = -1,
}

enum MatchStopType{
    BestOf,
    FirstTo,
    NumMaps,
}

type LeagueInfoObject = {
    teams: TeamInfoObject[],
    matches: MatchInfoObject[],
    table: TableInfoObject,
    isComplete?: boolean,
}

type TableInfoObject = TableRowInfoObject[]

type TableRowInfoObject = {
    team: number,
    points: number,
    mapDiff: number,
    matchesPlayed: number,
    w: number,
    l: number,
    d: number,
    live?: boolean
}

type MatchInfoObject = {
    home: number,
    away: number,
    week: number,
    score: ScoreInfoObject,
    stopCondition: StopCondition,
    result?: Result
    live?: boolean
}

type StopCondition = {
    type: MatchStopType,
    value: number
}

type ScoreInfoObject = {
    home: number,
    away: number,
    mapsPlayed: number,
}

type TeamInfoObject = {
    name: string,
    sr: number,
}