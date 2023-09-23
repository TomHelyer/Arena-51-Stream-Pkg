import express from 'express';
import { Server } from 'socket.io';
import updateHeroBans from '../handlers/hero-bans';
import { HeroBansObject, ScoreObject } from '../../types';

let heroBans: HeroBansObject = {
    home: [""],
    away: [""]
}

export const router = (io: Server) => {
  const router = express.Router();

  router.route('/herobans')
  .get((req,res) => {
    res.json({heroBans: heroBans});
  })
  .post((req,res) => { 
    if(req.body && req.body.heroBans && req.body.heroBans.home && req.body.heroBans.away)
    {
      heroBans = req.body.heroBans;
      io.emit('heroBans', {heroBans: heroBans});

      res.status(201).json({heroBans: heroBans});
    }
    else{
        res.status(400).send("bad Hero object");
    }
  });
      
  return router;
};

export const updateHeroBansObject = (io: Server, score: ScoreObject) => {
  heroBans = updateHeroBans(score, heroBans);
  io.emit('heroBans', {heroBans: heroBans});
}

