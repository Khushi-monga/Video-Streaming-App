import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();


router.route("/register").post(  //iss route pe post request execute krni hai and control transfer to middleware, then that passes to next -> given function
    upload.fields([ //file handling before registration
        {
            name: "avatar", //the name of the field on the frontend must be the same one as here 
            maxCount: 1
        },
        {
            name: "coverImg", //same here 
            maxCount: 1
        }
    ]),
    registerUser);


export default router