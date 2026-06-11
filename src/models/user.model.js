import mongoose, {Schema} from "mongoose";


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


export const User = mongoose.model("User", userSchema)
