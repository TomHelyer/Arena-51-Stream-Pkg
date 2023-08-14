export const generateMatches: (numTeams: number) => MatchInfoObject[] = (numTeams) => {
    let matches: MatchInfoObject[] = [];
    let rndIndexer = indexRnd(numTeams);
    for(let home = 0; home < numTeams; home++){
        for(let away = home + 1; away < numTeams; away++){
            let h = rndIndexer[home];
            let a = rndIndexer[away];
            let week = 1;
            let filter = matches.filter(m => {
                return (m.week === week) && ((m.home === h) || (m.home === a) || (m.away === h) || (m.away === a))
            });
            while(filter.length > 0){
                week = week + 1;
                filter = matches.filter(m => {
                    return (m.week === week) && ((m.home === h) || (m.home === a) || (m.away === h) || (m.away === a))
                });

            }
            let match: MatchInfoObject = {
                home: h,
                away: a,
                week,
                score: {
                    home: 0,
                    away: 0,
                    mapsPlayed: 0
                },
                stopCondition: {
                    type: MatchStopType.NumMaps,
                    value: 4
                }
            }
            matches = [...matches,match];
        }
    }
    return matches.sort((a,b) => a.week - b.week);
}

export const matchMapResult: (res: Result, match: MatchInfoObject) => MatchInfoObject = (res,match) =>
{
    match.live = true;
    switch(res){
        case Result.Home:
            match.score.home++;
            break;
        case Result.Away:
            match.score.away++;
            break;
    }
    match.score.mapsPlayed++;

    switch(match.stopCondition.type){
        case MatchStopType.BestOf:
            if(match.score.home === match.score.away)
                break;
        case MatchStopType.NumMaps:
            if(match.score.mapsPlayed >= match.stopCondition.value)
                match.result = match.score.home > match.score.away? Result.Home: match.score.home === match.score.away? Result.Draw: Result.Away;
            break;
        case MatchStopType.FirstTo:
            if(match.score.home >= match.stopCondition.value)
                match.result = Result.Home;
            else if(match.score.away >= match.stopCondition.value)
                match.result = Result.Away;
            break;
    }

    if(match.result !== undefined)
        match.live = false;
    return match;
} 

export const genTable: (matches: MatchInfoObject[], numTeams: number) => TableInfoObject = (matches, numTeams) => {
    let table: TableInfoObject = [];
    for(let x = 0; x < numTeams; x++){
        table = [...table, {
            team: x,
            points: 0,
            mapDiff: 0,
            matchesPlayed: 0,
            w: 0,
            l: 0,
            d: 0
        }];
    }
    matches.forEach((match: MatchInfoObject) => {
        if(match.result === undefined && !match.live)
            return match;
        
        table[match.home].mapDiff = table[match.home].mapDiff + match.score.home - match.score.away;
        table[match.away].mapDiff = table[match.away].mapDiff + match.score.away - match.score.home;

        switch(match.result)
        {
            case Result.Home:
                table[match.home].points = table[match.home].points + 3;
                table[match.home].w++;
                table[match.away].l++;
                break;
            case Result.Away:
                table[match.away].points = table[match.away].points + 3;
                table[match.away].w++;
                table[match.home].l++;
                break;
            case Result.Draw:
                table[match.home].points++;
                table[match.away].points++;
                table[match.away].d++;
                table[match.home].d++;
                break;
        }

        table[match.home].matchesPlayed++;
        table[match.away].matchesPlayed++;

        if(match.live){
            table[match.home].live = true;
            table[match.away].live = true;
        }

        return match;
    });

    return table.sort((a,b) => (b.points - a.points) !== 0? (b.points - a.points): (b.mapDiff - a.mapDiff));
}

const indexRnd: (numTeams: number) => number[] = (numTeams) => {
    let arr: number[] = [];
    for(let x = 0; x < numTeams; x++){
        arr = [...arr,x];
    }
    return arr.sort(() => Math.random() - 0.5);
}