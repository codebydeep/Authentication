import {registerUser, verifyUser, login} from "../controllers/user.controller.js"
import express from "express"

const router = express.Router()

router.post('/register', registerUser)
router.get('/verify:token', verifyUser)
router.post('/login', login)

export default router