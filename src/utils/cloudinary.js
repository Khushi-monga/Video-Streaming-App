import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

//configure your cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//function to upload files to cloudinary 
const uploadOnCloudinary = async (localPath) =>{

    try {
        if(!localPath) return null;
        
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        //successful upload
        console.log("File successfully uploaded on Cloudinary ", response.url);
        fs.unlinkSync(localPath)
        return response;

    } catch (error) {
        fs.unlinkSync(localPath); //Removes the locally saved file from the system since the upload operation failed 
        return null;       
    }
}

export {uploadOnCloudinary}