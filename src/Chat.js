import React, { useEffect, useState } from 'react'
// CSS block and element and modifiers
import io from "socket.io-client"
import { v4 as uuidv4 } from 'uuid'; 
const myId = uuidv4(); // globally unique identifier (GUID)

const socket = io("http://localhost:8080")
socket.on('connect', () => console.log(socket.id))


const Chat = () => {
  const [userName, setUserName] = useState('')
  const [name, updateName] = useState([{id: myId, name: "", changeInput: false}])
  const [message, updateMessage] = useState('')
  const [messages, updateMessages] = useState([])
  const [online, setOnline] = useState([])



  useEffect(()=> {
    const handleNewMessage = newMessage => updateMessages([...messages, newMessage]) // two params
    socket.on('chat.message', handleNewMessage)
    return () => socket.off('chat.message', handleNewMessage)
  },[messages])

  useEffect(()=> {
    const handleOnline = newOnline => setOnline([...online, newOnline]) // two params, for this hook too
    socket.on('online.user', handleOnline)
    return () => socket.off('online.user', handleOnline)
  },[online])
  


  const handleFormSubmit = e => {
    e.preventDefault()
    if(name[0].changeInput === false){ 
     // updates the user name
      updateName([{id: myId, name: userName,  changeInput: true}])
      // the bellow creates an array of online users
      socket.emit('online.user', [socket.id, userName])
    }else{
      if(message.trim()){ 
        socket.emit('chat.message', {id: myId, message, name: userName})
  
        updateMessage('')
        // if there is any message inside the input box it cleans it, like the shopping list
      }
    }

   
  }
  const handleInputChange = e => {
    updateMessage(e.target.value)
  }
  const handleName = e => {
    setUserName(e.target.value)
    
  }
  let inputType = "name"
  let functionType = handleName
  let valueType = userName

  
  // this condition changes the input from name to message after its name is typed
  if(name[0].changeInput === true){
    inputType = "message"
    functionType = handleInputChange
    valueType = message
  }
  console.log(online)
  function handleDesconnect(){
    socket.emit('chat.message', {id: myId, message: userName + " has left this room..." , name: "ChatsUpp"})
    socket.disconnect()
    window.location.reload();

  }
  return (
  <main className="container">
    <ul className="list">
      { messages.map((m,index) => 
      <li className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`} key={index}> 
        <span className={`message message--${m.id === myId ? 'mine' : 'other'}`} >
          {`${m.name}: ${m.message}`}
        </span>
      </li>  
      ) }
    </ul>
    <div className="footer">
    <form className="form" onSubmit={handleFormSubmit}>
    <input className="form__field" onChange={functionType} placeholder={`Type new ${inputType}`} type="text" value={valueType}/>
    </form>
    <button onClick={handleDesconnect}>Leave Chat</button> 
    </div>
  </main>
    
  )
}
export default Chat
// p key={users.id}>{users.name}</p>