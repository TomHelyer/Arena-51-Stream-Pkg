import { ScoreObject, HeroBansObject } from "../types";

export default (score: ScoreObject, heroBans: HeroBansObject) => {
    let mapNo = score[0] + score[1] + score[2];
    if (mapNo >= heroBans.home.length){
        heroBans.home.push(...Array<string>((mapNo - heroBans.home.length) + 1).fill(""));
    }
    else if(mapNo + 1 < heroBans.home.length){
        heroBans.home = heroBans.home.slice(0,mapNo + 1);
    }
    if (mapNo >= heroBans.away.length){
        heroBans.away.push(...Array<string>((mapNo - heroBans.away.length) + 1).fill(""));
    }
    else if(mapNo + 1 < heroBans.away.length){
        heroBans.away = heroBans.away.slice(0,mapNo + 1);
    }
    return heroBans;
}