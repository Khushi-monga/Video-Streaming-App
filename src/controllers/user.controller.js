import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async (req, res) => {
    //Logic building and writing down step by step process before writing code 
    //1. Get user details from frontend (rn assuming the data comes in from either a form or as json)
    //2. validation - not empty, valid format, etc
    //3. check whether user already exists - username, email
    //4. check for images and avatar
    //5. upload images and avater to cloudinary - check for successful upload
    //6. Create user object - create entry in db
    //7. remove password and refreshtoken field from response
    //8. check for user creation (hua ki nhi)
    //9. return res (could also need to return error response at many of the steps above in case of errors)

    //1.handling text details (images upload handles with middleware) 
    const {fullName, email, username, password} = req.body // take the values from req.body Ig
    console.log("email: ", email);

    //2.validation
    //Here we're just seeing one of the validation, usually there's a separate file with all the vaiidation functions which we simply call here 
    //No empty fields
    if(
        [fullName,email,username,password].some( //applies given condition to all and if even one returns true, then final return true
            (field) => field?.trim() === "" //didn't use curly braces cuz they require explicit return statement, but yaha ek line ka hi kaam tha
        )
    ){
        //if even anyone is empty, we need to throw error
        throw new ApiError(400, "All fields are required") //according to the syntax we defined for apierror
    }

    //3. Checking for existing user
    const existingUser = await User.findOne({
        $or: [{ username }, { email }] //returns first doc/record that matches the given email or username
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //4. Check for coverimgs and avatar
    //accessing imgs' local path from multer (req mei fields add kr deta hai so we can access them) 
    const avatarLocalPath = req.files?.avatar[0]?.path; //good practice to add optionally, reduces throwing of errors in case access is not there for some reason
    //const coverImgLocalPath = req.files?.coverImg[0]?.path; //coverimg[0] -> basically accessing the th property of this object

    let coverImgLocalPath;
    if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
        coverImgLocalPath = req.files.coverImg[0].path
    }


    //avatar is a required field so add the check for that 
    if(!avatarLocalPath) {
        throw new ApiError(409, "Avatar is reuired")
    }

    //5. Now upload the files to cloudinary (we already had a utility created for that)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg =  await uploadOnCloudinary(coverImgLocalPath)

    //final check for avatar being uploaded successfully 
    if(!avatar){
        throw new ApiError(409, "Avatar is reuired")
    }

    //Sara data achhe se aa chuka hai 
    //6. time to create a user object and then create a db entry
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImg: coverImg?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    //check whether the entry was succesfully created 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //deselct these fields if the user has been created 
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //Sab ho gya hai -> time to send the response (we have a utility for that too)
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered succesfully") 
    )
})




//LOGIN 


const generateRefrershAndAccessTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefrershToken()

    //update the refresh Token field in the record for this user in the db
    user.refreshToken = refreshToken
    await user.save()

    return {refreshToken, accessToken}
}


const loginUser = asyncHandler( async (req, res) => {
    //Get userdetails -> email/username , password
    //validation of details 
    //check whether user exists -> db query 
    //if not -> error
    //if yes -> verify password
    //access and refresh token 
    //send cookie
    //send response
    
    const {username, email, password} = req.body

    //validation file likhke import krne ka check krna pdega 
    if(!username || !email){
        throw new ApiError(400, "Username or email is required")
    }

    //check user exists 
    const user = await User.findOne({
        $or: [{ username }, { password }]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    //verify password -> we had created the method in our model 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    //Created a method here only to generate access and refresh tokens together
    const {refreshToken, accessToken} = await generateRefrershAndAccessTokens(user._id)

    //now depending on the cost of the dp query -> if it's economic => make another db call, else update the same userobject to reflect the saved changes after token generation
    //here we make another call
    const loggedInUser = User.findById(user._id).select("-password -refreshToken") //we can use this to send in the response too that's why teh select

    //configuring options (settings) for cookies to ensure that cookies are secure and only server can modify them
    const options = {
        httpOnly: true,
        secure: true
    }

    //send back the response and cookies
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
})




export {
    registerUser,
    loginUser
} 