interface Message {
  userId: string
  username: string
  timestamp: number
  text: string
}

export class ChatController {
  messages: Message[]

  constructor() {
    this.messages = []
  }

  addMessage(
    userId: string,
    username: string,
    timestamp: number,
    text: string,
  ) {
    const message: Message = { userId, username, timestamp, text }
    this.messages.push(message)
    return message
  }

  getMessages() {
    return this.messages.slice(-50)
  }
}
