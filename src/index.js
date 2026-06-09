import dotenv, { config } from "dotenv"
import express from "express"

import connectDB from "./db/index.js"
import dns from "node:dns"
dns.setServers(['1.1.1.1', '8.8.8.8'])

dotenv.config({
    path: "../.env"
})

connectDB()