type leagueInfoObject = {
    teams: teamInfoObject[],
    matches: matchInfoObject[],
    table: tableInfoObject,
    isComplete?: boolean,
}

type tableInfoObject = tableRowInfoObject[]

type tableRowInfoObject = {
    team: number,
    points: number,
    mapDiff: number,
    matchesPlayed: number,
    w: number,
    l: number,
    d: number,
    live?: boolean
}

type matchInfoObject = {
    home: number,
    away: number,
    week: number,
    score: scoreInfoObject,
    stopCondition: stopCondition,
    result?: result
    live?: boolean
}

type stopCondition = {
    type: matchStopType,
    value: number
}

type scoreInfoObject = {
    home: number,
    away: number,
    mapsPlayed: number,
}

type teamInfoObject = {
    name: string,
    sr: number,
    logo?: string,
}
