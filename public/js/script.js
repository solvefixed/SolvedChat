// eslint-disable-next-line no-undef
const socket = io()
const historyMessage = []
let username = null

const addMessage = (userId, username, timestamp, text) => {
  const msgItem = document.createElement('div')
  msgItem.className = 'chat__msg-item msg'

  const lastMessage = historyMessage[historyMessage.length - 1]
  console.log(lastMessage)
  if (!lastMessage || lastMessage.userId !== userId) {
    const msgInfo = document.createElement('div')
    msgInfo.className = 'msg__info'

    const msgUsername = document.createElement('div')
    msgUsername.className = 'msg__username username'
    msgUsername.textContent = username
    msgInfo.append(msgUsername)

    const msgTime = document.createElement('div')
    msgTime.className = 'msg__time'
    const date = new Date(timestamp * 1000)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    msgTime.textContent = `${hours}:${minutes}`
    msgInfo.append(msgTime)

    msgItem.append(msgInfo)
  }

  const msgText = document.createElement('div')
  msgText.className = 'msg__text'
  msgText.textContent = text
  msgItem.append(msgText)

  const msgList = document.getElementsByClassName('chat__msg-list')[0]
  msgList.prepend(msgItem)
}

window.addEventListener('load', () => {
  username = decodeURI(document.cookie.split('username=')[1].split(';')[0])
  document.getElementsByClassName('header__username')[0].textContent = username

  socket.on('connect', () => {
    socket.emit('auth', username)
  })

  socket.on('messages', data => {
    for (const message of data) {
      addMessage(
        message.userId,
        message.username,
        message.timestamp,
        message.text,
      )
      historyMessage.push(message)
    }
  })

  socket.on('message', data => {
    addMessage(data.userId, data.username, data.timestamp, data.text)
    historyMessage.push(data)
  })

  const textarea = document.getElementsByClassName('chat__textarea')[0]
  const sendButton = document.getElementsByClassName('chat__send-button')[0]

  const resetTextarea = () => {
    textarea.value = ''
    textarea.style.height = '37px'
    sendButton.style.display = 'none'
  }

  socket.on('disconnect', () => {
    resetTextarea()
    const msgList = document.getElementsByClassName('chat__msg-list')[0]
    msgList.innerHTML = ''
  })

  textarea.addEventListener('keypress', e => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (textarea.value) {
        socket.emit('message', textarea.value)
        resetTextarea()
      }
    }
  })

  textarea.addEventListener('input', e => {
    textarea.style.height = '37px'
    const scrollHeight =
      (textarea.scrollHeight > 118 ? 118 : textarea.scrollHeight) + 'px'
    if (textarea.style.height !== scrollHeight) {
      textarea.style.height = scrollHeight
    }

    if (e.target.value) {
      if (sendButton.style.display === 'none') {
        sendButton.style.display = ''
      }
    } else {
      sendButton.style.display = 'none'
    }
  })

  sendButton.addEventListener('click', () => {
    socket.emit('message', textarea.value)
    resetTextarea()
  })
})
