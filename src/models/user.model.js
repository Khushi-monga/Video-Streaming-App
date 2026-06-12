import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true //makes the field appear in db searching
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImg: {
            type: String, //cloudinary url
        },
        refreshToken: {
            type: String
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    }, 
    {timestamps: true}
)

//Saving password securely 
//The pre hook is kind of a middleware use to execute functions just before certain events on the object it is being used with 
//userSchema ->object used with pre; save -> event => thus, executes the specified function before saving userSchema
userSchema.pre("save", async function (next) {
    if(! userSchema.isModified("password")) return;
    
    //only change password if it has been modified -> either entered for the first tine or updated later
    this.password = bcrypt.hash(this.password, 10)
    next()
})


//password verification
//mongoose allows us to inject custom made methods for schemas 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

//Creating more methods for the schema for generating tokens 
//generating access token
userSchema.methods.generateAccessToken = function (){
    //sign method -> generates token
    return jwt.sign(
        //payload object
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        //token secret 
        process.env.ACCESS_TOKEN_SECRET,
        //expiresIn
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefrershToken = function (){
    //sign method -> generates token
    return jwt.sign(
        //payload object -> refresh token uses less payload
        {
            _id: this._id,
        },
        //token secret 
        process.env.REFRESH_TOKEN_SECRET,
        //expiresIn
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}


export const User = mongoose.model("User", userSchema)
