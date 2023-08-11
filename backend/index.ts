import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { genTable, generateMatches, matchMapResult } from "./league/functions";
import {leagueInfoObject, scoreInfoObject, teamInfoObject} from "./league/types";
import fs from "fs";
import path from "path";
import 'dotenv/config';

enum mapState{
    Con=0,
    Home=1,
    Away=2,
}

const app = express();
app.use(express.json({limit: "3mb"}));

const port = 8081;
const corsUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const repoPath = path.resolve(__dirname,"/repo");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: corsUrl
    }
});

let teamList: string[] = [];

fs.promises.readdir(`${__dirname}/repo/team`).then((files) => {
    for (let i of files)
        teamList = [...teamList, i.split('.')[0]];
})

let state: stateObject = {
    nextMap: "busan",
    casters: [
        {
            name: "Heller"
        },
        {
            name: "NerdFighter"
        }
    ],
    scoreboard: {
        score:[0,0,0],
        match: {
            home: {
                name: "Home",
                rank: "Bronze",
            },
            away: {
                name: "Away",
                rank: "Grand Master",
            },

        },
        mapState: mapState.Home,
        flip: false,
    },
    heroBans: {
        home: [""],
        away: [""]
    }
}

let leagueInfo: leagueInfoObject = {
    teams: [],
    matches: [],
    table: []
}

app.use(cors({
    origin: corsUrl
}));

app.use(express.json());

app.get('/nextmap', (req, res) => {
    res.json({map: state.nextMap});
})

app.get('/casters', (req, res) => {
    res.json(state.casters);
})

app.get('/scoreboard', (req,res) => {
    res.json(state.scoreboard);
})

app.get('/teams/list', (req,res) => {
    res.json(teamList);
})

app.get('/herobans',(req,res) => {
    res.json({heroBans: state.heroBans});
})

app.post('/herobans',(req,res) => { 
    if(req.body && req.body.heroBans && req.body.heroBans.home && req.body.heroBans.away)
    {
        state.heroBans = req.body.heroBans;
        io.emit('heroBans', {heroBans: state.heroBans});

        console.log(state.heroBans);

        res.status(201).json({heroBans: state.heroBans});
    }
    else{
        res.status(400).send("bad Hero object");
    }
});

app.post('/teams/add', (req,res) => {
    if(req.body && req.body.name && req.body.logo)
    {
        const buf = Buffer.from(req.body.logo, "base64");
        fs.promises.writeFile(`${__dirname}/repo/team/${req.body.name}.png`, buf)
        .then(val => {
            if(teamList.every((val: string) => val !== req.body.name))
                teamList = [...teamList, req.body.name];
            res.status(200).json({teamList: teamList});
            io.emit('teams', {teams: teamList});
            if(state.scoreboard.match.home.name === req.body.name || state.scoreboard.match.away.name === req.body.name)
            {
                io.emit('scoreboard:match', {match: state.scoreboard.match}); 
            };
        });
    }
    else{
        res.status(400).send("bad team object");
    }
})

app.post('/nextmap', (req, res) => {
    if(req.body.map)
    {
        state.nextMap = req.body.map;
        io.emit('nextmap', state.nextMap);

        res.status(201).json({map: state.nextMap});
    }
    else{
        res.status(400).send("bad Map object");
    }
});

app.post('/casters', (req, res) => {
    if(req.body)
    {
        let casters = req.body;
        if(castersCheck(casters)){
            state.casters = casters;

            io.emit('casters', state.casters);

            res.status(201).json({
                casters: state.casters,
            });
        }
        else{
            res.status(400).send("Invalid caster element in request body");
        }
    }
    else
        res.status(400).send("No caster element in request body");
});

app.post('/league/addTeam', (req, res) => {
    if(leagueInfo.matches.length > 0){
        res.status(405).json({
            message: "can't add teams after match generation",
            matches: leagueInfo.matches,
        });
    }
    else if(req.body.team)
    {
        const team: teamInfoObject = req.body.team;
        if(team.name && team.sr){
            leagueInfo.teams = [...leagueInfo.teams, team];
            res.json(leagueInfo.teams);
        }  
    }
    else{
        res.sendStatus(404);
    }
});

app.post('/league/demo', (req, res) => {
    let demo: leagueInfoObject = {
        teams: [],
        matches: [],
        table: []
    }
    for(let x = 0; x < 8; x++){
        demo.teams = [...demo.teams, {
            name: `Team ${x}`,
            sr: Math.floor(Math.random() * 10) * 100 + 3500
        }]
    }
    demo.teams = demo.teams.sort((a,b) => b.sr - a.sr);
    demo.matches = generateMatches(demo.teams.length);

    for(let x = 0; x < 17; x++){
        let score: scoreInfoObject= {
            home: 0,
            away: 0,
            mapsPlayed: 0
        }
        for(let map = 0; map < 4; map++){
            matchMapResult(Math.floor(Math.random() * 3) - 1 ,demo.matches[x]);
        }
    }

    matchMapResult(Math.floor(Math.random() * 3) - 1 ,demo.matches[17]);

    demo.table = genTable(demo.matches, demo.teams.length);

    res.send(demo);
});

app.post('/league/genMatches', (req, res) => {
    leagueInfo.teams.sort((a,b) => b.sr - a.sr);
    leagueInfo.matches = generateMatches(leagueInfo.teams.length);
    res.status(200).json(leagueInfo.matches);
})

app.get('/league', (req, res) => {
    res.status(200).json(leagueInfo);
})

app.post('/scoreboard/match', (req, res) => {
    if(req.body && req.body.match){
        let match = req.body.match;
        if(matchInfoCheck(match as matchInfoObject)){
            state.scoreboard.match = match;
            io.emit("scoreboard:match", {match: match})
            res.status(201).json(match);
        }
        else{
            res.status(404).send("Invalid matchInfoObject");
        }
    }
    else{
        res.status(404).send("Invalid matchInfoObject");
    }
});

app.post('/scoreboard/flip', (req, res) => {
    if(req.body && req.body.flip !== undefined){
        state.scoreboard.flip = req.body.flip;
        res.status(200).json({flip: state.scoreboard.flip});
        io.emit('scoreboard:flip', {flip: state.scoreboard.flip});
    }
    else{
        res.status(400).send("bad request");
    }
})

app.post('/scoreboard/team', (req,res) => {
    if(req.body && req.body.team && req.body.side){
        if(req.body.side === "home"){
            state.scoreboard.match.home.name = req.body.team
            res.status(200).json(state.scoreboard.match);
            io.emit('scoreboard:match', {match: state.scoreboard.match}); 
        }
        else if(req.body.side === "away"){
            state.scoreboard.match.away.name = req.body.team
            res.status(200).json(state.scoreboard.match);
            io.emit('scoreboard:match', {match: state.scoreboard.match}); 
        }
        else{
            res.status(400).send("Invalid side");
        }
    }
    else{
        res.status(400).send("invalid body");
    }
})

app.post('/scoreboard/score', (req, res) => {
    if(req.body && req.body.score && req.body.score[0] >= 0 && req.body.score[1] >= 0 && req.body.score[2] >= 0){
        let score = req.body.score;
        if(Array.isArray(score)){
            state.scoreboard.score = score;
            io.emit("scoreboard:score", {score:score});
            res.status(201).json(state.scoreboard);

            let mapNo = score[0] + score[1] + score[2];
            if (mapNo >= state.heroBans.home.length){
                state.heroBans.home.push(...Array<string>((mapNo - state.heroBans.home.length) + 1).fill(""));
            }
            else if(mapNo + 1 < state.heroBans.home.length){
                state.heroBans.home = state.heroBans.home.slice(0,mapNo + 1);
            }
            if (mapNo >= state.heroBans.away.length){
                state.heroBans.away.push(...Array<string>((mapNo - state.heroBans.away.length) + 1).fill(""));
            }
            else if(mapNo + 1 < state.heroBans.away.length){
                state.heroBans.away = state.heroBans.away.slice(0,mapNo + 1);
            }
            io.emit('heroBans', {heroBans: state.heroBans});
        }
        else{
            res.status(400).send("Invalid matchInfoObject");
        }
    }
    else{
        res.status(400).send("Invalid matchInfoObject");
    }
});

app.post('/scoreboard/mapState', (req, res) => {
    if(req.body && req.body.mapState){
        let mapState = req.body.mapState;
        state.scoreboard.mapState = mapState;
        if(mapState <= 2)
        {
            io.emit("scoreboard:mapState", {mapState: mapState});
            res.status(201).json(state.scoreboard);
        }
        else{
            res.status(404).send("Invalid mapState");
        }
    }
    else{
        res.status(404).send("Invalid mapState");
    }
});

app.get('/image/:bucket/:image', (req,res) => {
    fs.promises.readFile(`${__dirname}/repo/${req.params.bucket}/${req.params.image}.png`, {encoding: 'base64'})
    .then(val => {
        res.status(200).json({image: val});
    }).catch(err => res.status(401).send(err));
});

httpServer.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

type CasterObject = {
    name: string,
    vdo?: string
}

const casterCheck: (obj: CasterObject) => boolean = (obj) => {
    return obj.name !== undefined;
}

type CastersObject = CasterObject[]

const castersCheck: (obj: CastersObject) => boolean = (obj) => {
    return Array.isArray(obj) && obj.every(val => casterCheck(val))
}

type stateObject = {
    casters: CastersObject,
    nextMap: string,
    scoreboard: scoreboardObject,
    heroBans: HeroBansObject
}

type HeroBansObject = {
    home: string[],
    away: string[]
}

type scoreboardObject = {
    score: scoreObject,
    match: matchInfoObject,
    mapState: mapState,
    flip: boolean
}

type statsObject = {
    points?: number,
    winLossDraw?: number[],
    mapDiff?: number,
}

type matchInfoObject = {
    home: teamObject,
    away: teamObject,
    stats?: statsObject[]
}

const matchInfoCheck: (obj: matchInfoObject) => boolean = (obj) => {
    if(obj.home && obj.away){
        return teamObjectCheck(obj.home) && teamObjectCheck(obj.away);
    }
    return false;
}

type teamObject = {
    name: string,
    rank: "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum" | "Master" | "Grand Master" | "Top 500",
}

const teamObjectCheck: (obj: teamObject) => boolean = (obj) => {
    return (obj.name !== undefined) && (obj.rank !== undefined)
}

type scoreObject = number[];