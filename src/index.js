import dotenv, { config } from "dotenv"
import express from "express"
import { app } from "./app.js"

import connectDB from "./db/index.js"
import dns from "node:dns"
dns.setServers(['1.1.1.1', '8.8.8.8'])

dotenv.config({
    path: "../.env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is listening at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDb failed to connect !!!", err)
})