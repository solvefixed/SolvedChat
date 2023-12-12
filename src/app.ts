import http from 'http'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { isValidUsername } from './utils'

export class ChatApp {
  app: express.Express
  httpServer: http.Server

  constructor() {
    this.app = express()
    this.httpServer = http.createServer(this.app)
  }

  setMiddleware() {
    this.app.use(express.static(path.join(__dirname, '../public')))
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  setHandlers() {
    this.app.get('/', (req, res) => {
      if (!isValidUsername(req.cookies.username)) {
        res.sendFile('login.html', {
          root: path.join(__dirname, '../pages'),
        })

        return
      }

      res.sendFile('chat.html', {
        root: path.join(__dirname, '../pages'),
      })
    })

    this.app.get('/reset', (_req, res) => {
      res.clearCookie('username')
      res.redirect('/')
    })

    this.app.post('/', (req, res) => {
      const username = req.body.username
      if (isValidUsername(username)) {
        console.log(username)
        res.cookie('username', username)
      }

      res.redirect('/')
    })
  }
}
