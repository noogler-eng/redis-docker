import express from "express";
import { rateLimiter } from './rateLimit';
// import cors from "cors";

const app = express();
// app.use(cors());
app.use(rateLimiter);
let count = 0;

app.get("/site", (req, res)=>{
    console.log("this route ping times: ",count);
    res.json({
        name: "rate limiter checking"
    })
})

const port = 8080;
app.listen(port, ()=>{
    console.log("server running at: ",port);
})