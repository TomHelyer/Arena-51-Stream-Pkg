import express from 'express';
import { Server } from 'socket.io';

let mapAdvanced: string = "None";

export default (io: Server) => {
    const router = express.Router();

    router.route('/mapoverview')
        .get((req, res) => {
            res.json({mapAdvanced: mapAdvanced});
        })
        .post((req, res) => {
            if(req.body.mapAdvanced)
            {
                mapAdvanced = req.body.mapAdvanced;
                io.emit('mapoverview', mapAdvanced)

                res.status(201).json({mapAdvanced: mapAdvanced});
            }
            else {
                res.status(400).send("bad Map object");
            };
        });

    return router;
};