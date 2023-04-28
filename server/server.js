import express from 'express'
import cors from 'cors'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import { check } from 'express-validator'

import {
    readData,
    writeFile,
} from './functions.js'

import {
    register,
    registerDetails,
    login,
    logout
} from './controller/authController.js'

import {
    validateLoginData,
    validateRegisterData
} from './middleware/validation.js'

import { encrypt, verifyJWTCookie } from './middleware/authMiddleware.js'

import { verifyToken } from './util/token.js'

import './util/config.js'

const app = express()
const PORT = 8080 || process.env.BACKFALL_PORT;

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(cookieParser())

const upload = multer({ dest: 'uploads/' })

app.use(express.json())

app.get('/', readData)

app.post('/editor', writeFile)



app.post('/register', validateRegisterData, encrypt, register)
app.post('/register-details', verifyJWTCookie, registerDetails)
app.post('/login', validateLoginData, encrypt, login)
app.get('/logout', logout)

app.get('/validate', verifyJWTCookie, (req, res) => {
    console.log('foo', req.claim.user)
    res.end(req.claim.user)
})

app.listen(PORT, () => { console.log(`Server listening on ${PORT}`) })
