import express from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from 'http'
import cors from 'cors'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: 'https://robertoeschz.web.app',
    }
})

app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {    
    
    socket.on('message', (data) => {
        socket.broadcast.emit('message', {
            body: data.message,
            from: data.username
        })
    })
})

server.listen(PORT, () => {
    console.log('Server on port', PORT)
})
