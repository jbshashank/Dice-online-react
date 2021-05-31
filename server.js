const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const { addUser, removeUser, getUser, getUsersInRoom,updateUserData } = require('./users')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

var userData = {}

app.use(cors())

io.on('connection', socket => {
    socket.on('join', (payload, callback) => {
        let numberOfUsersInRoom = getUsersInRoom(payload.room).length
        const { error, newUser} = addUser({
            id: socket.id,
            name: payload.name,
            room: payload.room,
            currentScore:0,
            totalScore:0
        })
        if(error){
            console.log('error'+error)
            return callback(error)
        }
        socket.join(newUser.room)
        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        callback()
    })

    socket.on('updateGameState', gameState => {
        const user = getUser(socket.id)
        const {name,currentScore} = gameState
        const updatedData = updateUserData(user,currentScore)
        console.log(updatedData)
        if(user)
            io.to(user.room).emit('updateGameState', updatedData)
    })

    socket.on('sendMessage', (payload, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text: payload.message})
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    })
})

//serve static assets in production
if(process.env.NODE_ENV === 'production') {
	//set static folder
	app.use(express.static('client/build'))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})