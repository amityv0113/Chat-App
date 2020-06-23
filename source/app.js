const path = require('path')
const http = require('http')
const Filter = require('bad-words')

const { generatemessage ,generateLocationMessage} = require('./utils/message')

const {addUser ,removeUser,getUser,getuserInroom} = require('./utils/user')

const express = require('express')
const app = express()
const socketio = require('socket.io')
const { Socket } = require('dgram')
const server = http.createServer(app)

const io = socketio(server)

const port  = process.env.PORT || 3000

const public_dir = path.join(__dirname,'../public')

app.use(express.static(public_dir))


/////////////////////////////////////////////////////////

io.on('connection', (socket) =>{
    console.log('New WebSocket connection')

    
    socket.on('join',({username,room},callback)=>{
        const {error ,user} = addUser({id:socket.id,username:username,room:room})
        
        if (error)
        {
            return callback(error)
        }

        socket.join(user.room)
        

        socket.emit('message',generatemessage('welcome'))
        socket.broadcast.to(user.room).emit('message',generatemessage(user.username+' has joined !'))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getuserInroom(user.room)
        })

    })



    socket.on('send-message',(val,callback_func)=>{

        const user = getUser(socket.id)

        const filter = new Filter({ placeHolder: '*'})
       
        val=filter.clean(val);
        io.to(user.room).emit('message',generatemessage(user.username,val))
        

        callback_func('to all in group')
    })



    socket.on('send_location',(val,callback)=>{

        const user = getUser(socket.id)

        io.to(user.room).emit('location_message',generateLocationMessage(user.username,'https://google.com/maps?q='+val.latitude+','+val.longitude))
        callback()
    })





    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)

        if( user )
        {
            io.to(user.room).emit('message',generatemessage(user.username+' is disconnected'))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getuserInroom(user.room)
            })
    
        }

        
    })

    
})

server.listen(port,()=>{
    console.log('server is running on port : '+port)
})

