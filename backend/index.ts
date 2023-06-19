import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io"
import fs from "fs";
import path from "path";

enum matchStates{
    Home = 1,
    Away = -1,
    Draw = 0,
    NoResult = ""
}

enum mapState{
    Con=0,
    Home=1,
    Away=2,
}

const app = express();
app.use(express.json({limit: "2mb"}));
const port = 8080;
const repoPath = path.resolve(__dirname,"/repo");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
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
        score:[0,0],
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
}

app.use(cors({
    origin: 'http://localhost:3000'
}))
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
})

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
    if(req.body && req.body.score){
        let score = req.body.score;
        if(Array.isArray(score)){
            state.scoreboard.score = score;
            io.emit("scoreboard:score", {score:score});
            res.status(201).json(state.scoreboard);
        }
        else{
            res.status(404).send("Invalid matchInfoObject");
        }
    }
    else{
        res.status(404).send("Invalid matchInfoObject");
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
    });
})

httpServer.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
})

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
    scoreboard: scoreboardObject
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

///


