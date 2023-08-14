import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { genTable, generateMatches, matchMapResult } from "./league/functions";
import {leagueInfoObject, scoreInfoObject, teamInfoObject} from "./league/types";
import fs from "fs";
import 'dotenv/config';

import caster from './routes/caster';
import nextMap from './routes/next-map';
import imageRepo from './routes/image-repo';
import { router as heroBans, updateHeroBansObject } from "./routes/hero-bans";
import scoreboard from "./routes/scoreboard";

const app = express();
app.use(express.json({limit: "3mb"}));

const port = 8081;
const corsUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: corsUrl
    }
});

app.use(cors({
    origin: corsUrl
}));

app.use(express.json());

//routes
app.use(caster(io));
app.use(nextMap(io));
app.use(imageRepo);
app.use(heroBans(io));
app.use(scoreboard(io, (score: ScoreObject) => updateHeroBansObject(io,score)));
















let teamList: string[] = [];

fs.promises.readdir(`${__dirname}/repo/team`).then((files) => {
    for (let i of files)
        teamList = [...teamList, i.split('.')[0]];
})

let state: StateObject = {
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





app.get('/teams/list', (req,res) => {
    res.json(teamList);
})



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



httpServer.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});





