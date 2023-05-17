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

const app = express();
const port = 8080;
const repoPath = path.resolve(__dirname,"/repo");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let state: stateObject = {
    map: "busan",
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
                sr: 0,
            },
            away: {
                name: "Away",
                sr: 0
            },
            state: matchStates.NoResult
        }
    },
}

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json());

app.get('/nextmap', (req, res) => {
    res.json({map: state.map});
})

app.get('/casters', (req, res) => {
    res.json(state.casters);
})

app.get('/scoreboard', (req,res) => {
    res.json(state.scoreboard);
})

app.post('/nextmap', (req, res) => {
    if(req.body.map)
    {
        state.map = req.body.map;
        io.emit('nextmap', state.map);

        res.status(201).json({map: state.map});
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
            io.emit("scoreboard:match", match)
            res.status(201).json(match);
        }
        else{
            res.status(404).send("Invalid matchInfoObject");
        }
    }
    else{
        res.status(404).send("Invalid matchInfoObject");
    }
})

app.post('scoreboard/score', (req, res) => {
    if(req.body && req.body.score){
        let score = req.body.score;
        if(Array.isArray(score)){
            state.scoreboard.score = score;
            io.emit("scoreboard:score", score);
            res.status(201).json(state.scoreboard);
        }
        else{
            res.status(404).send("Invalid matchInfoObject");
        }
    }
    else{
        res.status(404).send("Invalid matchInfoObject");
    }
})

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
    map: string,
    scoreboard: scoreboardObject
}

type scoreboardObject = {
    score: scoreObject,
    match: matchInfoObject,
}

type matchInfoObject = {
    home: teamObject,
    away: teamObject,
    state: matchStates
}

const matchInfoCheck: (obj: matchInfoObject) => boolean = (obj) => {
    if(obj.home && obj.away && obj.state){
        return teamObjectCheck(obj.home) && teamObjectCheck(obj.away);
    }
    return false;
}

type teamObject = {
    name: string,
    sr: number,
}

const teamObjectCheck: (obj: teamObject) => boolean = (obj) => {
    return (obj.name !== undefined) && (obj.sr !== undefined)
}

type scoreObject = number[];

///


