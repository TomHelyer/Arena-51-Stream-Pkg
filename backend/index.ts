import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io"

const app = express();
const port = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
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

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json());

app.get('/nextmap', (req, res) => {
    res.json({
        map: state.map
    });
})

app.get('/casters', (req, res) => {
    res.json({
        casters: state.casters
    });
})

app.post('/nextmap', (req, res) => {
    if(req.body.map)
    {
        state.map = req.body.map;
        io.emit('nextmap', state.map);

        res.status(201).json({
            map: state.map
        });
    }
})

app.post('/casters', (req, res) => {
    if(req.body.casters)
    {
        state.casters = req.body.casters as CastersObject;
        io.emit('casters', state.casters);

        res.status(201).json({
            casters: state.casters
        });
    }
})

httpServer.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
})


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

