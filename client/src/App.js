import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

const socket = io('http://localhost:3000/')

function App() {
  const [usernameValue, setUsernameValue] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', {username, message})
    const newMessage = {
      body: message,
      from: username
    }
    setMessages([newMessage, ...messages])
    setMessage('')
  }

  const handleSetUsername = (e) => {
    e.preventDefault() 
    setUsername(usernameValue)
  }

  useEffect(() => {

    const reciveMessage = message => {
      setMessages([message, ...messages])
    }

    socket.on('message', reciveMessage)

    return () => {
      socket.off('message', reciveMessage)
    }
  }, [messages])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      {username ? <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
      <h1 className='text-2xl font-bold my-2'>Public chat</h1>
        <input className='border-2 border-zinc-500 p-2 text-black w-full' type="text" onChange={e => setMessage(e.target.value)} value={message} />
        <button className='bg-blue-500 p-2 mt-2 rounded' >send</button>

        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li key={index} className={`p-2 my-2 table text-sm rounded-md ${message.from === username ? "bg-sky-700 ml-auto" : "bg-black"}`}>
              <p>{message.from}: {message.body}</p>
            </li>
          ))}
        </ul>
      </form>
      : <form onSubmit={handleSetUsername} className="bg-zinc-900 p-10">
      <h1 className='text-2xl font-bold my-2'>Select your username</h1>
        <input className='border-2 border-zinc-500 p-2 text-black w-full' type="text" onChange={e => setUsernameValue(e.target.value)} value={usernameValue} />
        <button className='bg-blue-500 p-2 mt-2 rounded' >send</button>        
      </form>}
    </div>
  );
}

export default App;
