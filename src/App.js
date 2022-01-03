import React, { useEffect, useState } from 'react'
import socketIOClient from 'socket.io-client'

function App() {
  const [messageList, setMessageList] = useState([])
  const [nickName, setNickName] = useState('')
  const [newMessageText, setNewMessageText] = useState('')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIO = socketIOClient('http://172.23.39.251:8080')
    setSocket(socketIO)
  }, [])

  useEffect(() => {
    if(socket) {
      socket.on('initialMessageList', (messages) => {
        setMessageList(messages)
      })
      socket.on('newMessage', (message) => {
        console.log(messageList, message);
        setMessageList([...messageList, message])
      })
    }
  }, [socket, messageList])
  
  const handleSubmit = e => {
    e.preventDefault()
    
    const newMessage = {
      author: nickName,
      text: newMessageText
    }

    socket.emit('messageFromClient', newMessage)
  }

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map(message => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        )
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input 
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input 
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default App;
