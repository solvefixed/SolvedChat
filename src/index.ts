import { ChatApp } from './app'
import { ChatSocket } from './socket'

const port = 8080

const main = () => {
  const app = new ChatApp()
  app.setMiddleware()
  app.setHandlers()

  const httpServer = app.httpServer

  const socket = new ChatSocket(httpServer)
  socket.setHandlers()

  httpServer.listen(port, () => {
    console.log(`App and Socket running at port ${port}`)
  })
}

main()
