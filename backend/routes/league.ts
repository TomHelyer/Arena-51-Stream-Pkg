import express from 'express';
import { Server } from 'socket.io';import { genTable, generateMatches, matchMapResult } from "../handlers/league";

let leagueInfo: LeagueInfoObject = {
  teams: [],
  matches: [],
  table: []
}

export default (io: Server) => {
  const router = express.Router();

  router.post('/league/addTeam', (req, res) => {
    if(leagueInfo.matches.length > 0){
        res.status(405).json({
            message: "can't add teams after match generation",
            matches: leagueInfo.matches,
        });
    }
    else if(req.body.team)
    {
        const team: TeamInfoObject = req.body.team;
        if(team.name && team.sr){
            leagueInfo.teams = [...leagueInfo.teams, team];
            res.json(leagueInfo.teams);
        }  
    }
    else{
        res.sendStatus(404);
    }
});

router.post('/league/demo', (req, res) => {
    let demo: LeagueInfoObject = {
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
        let score: ScoreInfoObject= {
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

router.post('/league/genMatches', (req, res) => {
    leagueInfo.teams.sort((a,b) => b.sr - a.sr);
    leagueInfo.matches = generateMatches(leagueInfo.teams.length);
    res.status(200).json(leagueInfo.matches);
})

router.get('/league', (req, res) => {
    res.status(200).json(leagueInfo);
})
    
  return router;
};