import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connect } from 'mongoose'
import router from './router/index.js'
import errorMiddleware from './middlewares/error-middleware.js'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await connect(process.env.DB_URL)
    app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))
  } catch (err) {
    console.log(err)
  }
}

start()
