import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    //configuring the cors middleware 
    origin: process.env.CORS_ORIGIN
})) //app.use() -> middleware run for every incoming request made across teh entire app 

//Configuration for different types of inputs
// best practices/safety practices

//1. forms input -> json
app.use(express.json({limit: "16kb"})) // limit set for max imput size (kitna bhi loge to app crash kar jayegi)

//2. from urls (urls sometimes use different encodings)
app.use(express.urlencoded({
    limit: "16kb",
    extended: true //allows for greater nesting of objects
}))

//3. Saving files/ assets on the server -> in the public folder 
app.use(express.static("public")) //store in the public folder

//using middleware for cookies -> perform crud ops on cookies securely
app.use(cookieParser())




export { app }