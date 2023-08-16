import express from 'express';
import { Server } from 'socket.io';

let map: string = "busan";

export default (io: Server) => {
  const router = express.Router();

  router.route('/nextmap')
    .get((req, res) => {
      res.json({map: map});
    })
    .post((req, res) => {
      if(req.body.map)
      {
        map = req.body.map;
        io.emit('nextmap', map);

        res.status(201).json({map: map});
      }
      else{
        res.status(400).send("bad Map object");
      };
    });
    
  return router;
};