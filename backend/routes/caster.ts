import express from 'express';
import { Server } from 'socket.io';
import { CastersObject } from '../types';

const casterCheck = (obj: any) => {
  return obj.name !== undefined;
}

const castersCheck = (obj: any) => {
  return Array.isArray(obj) && obj.every(val => casterCheck(val))
}

let casters: CastersObject = 
[
  {
      name: "Heller"
  },
  {
      name: "NerdFighter"
  }
]

export default (io: Server) => {
  const router = express.Router();

  router.route('/casters')
    .get((req, res) => {
      res.json(casters);
    })
    .post((req, res) => {
      if(req.body)
      {
        let newObj = req.body;
        if(castersCheck(newObj)){
          casters = newObj as CastersObject;

          io.emit('casters', casters);

          res.status(201).json({
            casters: casters,
          });
        }
        else{
          res.status(400).send("Invalid caster element in request body");
        }
      }
      else
        res.status(400).send("No caster element in request body");
  });

  return router;
};



