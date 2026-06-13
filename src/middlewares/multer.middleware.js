import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) { //cb : callBack 
        cb(null, "./public/temp") //callback to save the file : cb(handle_error, destination)   
    },
    filename: function(req, file, cb){
        //Read the github documentation of multer for this (bohot kuch hai usme)
        cb(null, file.originalname) //(error_handle, how to store name of the file)
    }
})


export const upload = multer({
    storage: storage 
})