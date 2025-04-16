import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

    role:{
        type: String,
    },

    isVerified: {
        type: Boolean
    },
    
    verificationToken: {
        type: String,
    },

    verificationTokenExpiry: {
        type: Date,
    }
    
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User