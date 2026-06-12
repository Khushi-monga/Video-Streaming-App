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


//Routes import 
import userRouter from "./routes/user.routes.js";


//ROUTES DECLARATION 
//app.get() -> when the routes were defined in the same file. But not how it usually happens 
//you call the router as a middleware with app.use()
//app.use("/users", userRouter); //on receiving the request for /users -> activate userRouter 
app.use("/api/v1/users", userRouter); //good practice to mention api if you are defining an api and its version, updates lead to later versions
//So when the control is passed to the userRouter and it defines further routes, the url forms as : https://localhost:8000/api/v1/users/route_as_defined_in_userRouter



export { app }