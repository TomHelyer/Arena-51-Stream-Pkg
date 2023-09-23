import express from 'express';
import { Server } from 'socket.io';
import { MapState, ScoreObject, ScoreboardInfoObject, ScoreboardObjectBeta } from '../../types';

let scoreboard: ScoreboardObjectBeta = {
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
  mapState: MapState.Home,
  flip: false,
}

export default (io: Server, updateHeroBansArray: (score: ScoreObject) => void) => {
  const router = express.Router();

  router.get('/scoreboard', (req,res) => {
    res.json(scoreboard);
  });

  router.post('/scoreboard/match', (req, res) => {
    if(req.body && req.body.match){
      let match = req.body.match;
      if(matchInfoCheck(match as ScoreboardInfoObject)){
        scoreboard.match = match;
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
  
  router.post('/scoreboard/flip', (req, res) => {
      if(req.body && req.body.flip !== undefined){
          scoreboard.flip = req.body.flip;
          res.status(200).json({flip: scoreboard.flip});
          io.emit('scoreboard:flip', {flip: scoreboard.flip});
      }
      else{
          res.status(400).send("bad request");
      }
  })
  
  router.post('/scoreboard/team', (req,res) => {
      if(req.body && req.body.team && req.body.side){
          if(req.body.side === "home"){
              scoreboard.match.home.name = req.body.team
              res.status(200).json(scoreboard.match);
              io.emit('scoreboard:match', {match: scoreboard.match}); 
          }
          else if(req.body.side === "away"){
              scoreboard.match.away.name = req.body.team
              res.status(200).json(scoreboard.match);
              io.emit('scoreboard:match', {match: scoreboard.match}); 
          }
          else{
              res.status(400).send("Invalid side");
          }
      }
      else{
          res.status(400).send("invalid body");
      }
  })
  
  router.post('/scoreboard/score', (req, res) => {
      if(req.body && req.body.score && req.body.score[0] >= 0 && req.body.score[1] >= 0 && req.body.score[2] >= 0){
          let score = req.body.score;
          if(Array.isArray(score)){
              scoreboard.score = score;
              io.emit("scoreboard:score", {score:score});
              res.status(201).json({score: scoreboard.score});
  
              updateHeroBansArray(scoreboard.score);
          }
          else{
              res.status(400).send("Invalid matchInfoObject");
          }
      }
      else{
          res.status(400).send("Invalid matchInfoObject");
      }
  });
  
  router.post('/scoreboard/mapState', (req, res) => {
      if(req.body && req.body.mapState){
          let mapState = req.body.mapState;
          scoreboard.mapState = mapState;
          if(mapState <= 2)
          {
              io.emit("scoreboard:mapState", {mapState: mapState});
              res.status(201).json(scoreboard);
          }
          else{
              res.status(404).send("Invalid mapState");
          }
      }
      else{
          res.status(404).send("Invalid mapState");
      }
  });
    
  return router;
};