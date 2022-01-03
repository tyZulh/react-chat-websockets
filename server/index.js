const express = require('express')
const uniqid = require('uniqid')
const socketIo = require('socket.io')

const app = express()

const server = app.listen(8080, () => {
  console.log(`Server up and runnin on : 8080 `);
})

const io = socketIo(server, {
  cors: { origin: ['http://172.23.39.251:3000']}
})

const messages = [
  {id: uniqid(), author: 'wildServer', text: 'Welcome to the wildChat'}
]

io.on('connect', (socket) => {
  console.log('user connected to the chat');
  socket.on('disconnect', () => {
    console.log('user disconnected from the chat');
  })
  socket.emit('initialMessageList', messages)

  socket.on('messageFromClient', (newMessage) => {
    const message = {
      id: uniqid(),
      ...newMessage
    }
    messages.push(message)

    io.emit('newMessage', message)
  })
})
