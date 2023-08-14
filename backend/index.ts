import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import fs from "fs";
import 'dotenv/config';

import caster from './routes/caster';
import nextMap from './routes/next-map';
import imageRepo from './routes/image-repo';
import { router as heroBans, updateHeroBansObject } from "./routes/hero-bans";
import scoreboard from "./routes/scoreboard";

const app = express();
app.use(express.json({limit: "3mb"}));

const port = 8081;
const corsUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: corsUrl
    }
});

app.use(cors({
    origin: corsUrl
}));

app.use(express.json());

//routes
app.use(caster(io));
app.use(nextMap(io));
app.use(imageRepo);
app.use(heroBans(io));
app.use(scoreboard(io, (score: ScoreObject) => updateHeroBansObject(io,score)));

httpServer.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
