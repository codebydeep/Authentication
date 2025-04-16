import User from "../models/User.model.js"
import mongoose from "mongoose"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"

const registerUser = async (req, res) => {

    // Taking data from the user or body - 
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }

    // register user
    // If already register, then return status ""
    
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        // creating a user in a database
        const user = await User.create({
            name, email, password
        })
        console.log(user);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not registered!"
            })
        }

        // assign a token to the user
        const token = crypto.randomBytes(32).toString("hex")
        console.log(token);

        user.verificationToken = token

        // save the user into database
        await user.save()


        // Mail Bhejna baki hai -
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.MAILTRAP_SUPERMAIL,
            to: User.email,
            subject: "Verify your email",
            text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/${token}`,
            html: "<b> Hello Brother <b/>",
          }

          await transporter.sendMail(mailOptions)

          // user registered done -
        return res.status(200).json({
            success: true,
            message: "User registered successfully!"
        })
        
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}


const verifyUser = async (req, res) => {
    // check for token in params
    // find the user in the db
    // if found- user exists or not then "user not exists in db" 
    const {token} = req.params

    if(!token){
        return res.status(400).json({
            success: false,
            message: "Invalid Token!"
        })
    }

    try {
        const user = await User.findOne({verificationToken: token})

        if(!user){
            return res.status(500).json({
                success: false,
                message: "User not found!",
            })
        }

        user.isVerified = true

        user.verificationToken = null

        await user.save()

        return res.status(200).json({
            success: true,
            message: "User verified Done!"
        })
        
    } catch (error) {
        
    }
}


const login = async (req, res) => {
    // get data from user
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // Match the passwords -
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            })
        }

        const token = jwt.sign({id: user._id, role: user.role}, 
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000
        }

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Login successfull",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User not REGISTERED!"
        })
    }
}


export {registerUser, verifyUser, login}