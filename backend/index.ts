import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { genTable, generateMatches, matchMapResult } from "./league/functions";
import {leagueInfoObject, scoreInfoObject, teamInfoObject} from "./league/types";

const app = express();
const port = 8080;
const corsUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: corsUrl
    }
});

let state: stateObject = {
    map: "busan",
    casters: {
        0: {
            name: "Heller"
        },
        1: {
            name: "NerdFighter"
        }
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
    res.json({
        map: state.map
    });
});

app.get('/casters', (req, res) => {
    res.json({
        casters: state.casters
    });
});

app.post('/nextmap', (req, res) => {
    if(req.body.map)
    {
        state.map = req.body.map;
        io.emit('nextmap', state.map);

        res.status(201).json({
            map: state.map
        });
    }
});

app.post('/casters', (req, res) => {
    if(req.body.casters)
    {
        state.casters = req.body.casters as CastersObject;
        io.emit('casters', state.casters);

        res.status(201).json({
            casters: state.casters
        });
    }
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
})

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

type CasterObject = {
    name: string,
    vdo?: string
}

type CastersObject = {
    0: CasterObject,
    1: CasterObject,
}

type stateObject = {
    casters: CastersObject,
    map: string,
}

