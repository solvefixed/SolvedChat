import http from 'http'
import { Server } from 'socket.io'
import { ChatController } from './chat'
import { isValidUsername } from './utils'

export class ChatSocket {
	io: Server
	chatController: ChatController

	constructor(httpServer: http.Server) {
		this.io = new Server(httpServer)
		this.chatController = new ChatController()
	}

	setHandlers() {
		this.io.on('connection', socket => {
			let username: string | null = null

			socket.on('auth', data => {
				if (!isValidUsername(data)) return
				username = data

				const messages = this.chatController.getMessages()
				socket.emit('messages', messages)
			})

			socket.on('message', data => {
				if (!username) return
				console.log('#log |', socket.id, 'send message')

				const message = this.chatController.addMessage(
					socket.id,
					username,
					Math.floor(Date.now() / 1000),
					data
				)
				this.io.emit('message', message)
			})

			socket.on('disconnect', () => {
				console.log('#log |', socket.id, 'disconnected')
			})

			console.log('#log |', socket.id, 'has connected')
		})
	}
}
