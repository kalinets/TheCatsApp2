const express = require('express')
const path = require('path')
const cors = require('cors')
const socketIO = require('socket.io')
const connectDB = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json({ extended: false }))

const PORT = process.env.PORT || 6125

// connect to db
connectDB()

// define routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/favorites', require('./routes/favorites'))
app.use('/api/cats', require('./routes/catapi'))

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('./client/dist'))
  app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, 'client/dist/index.html'), err => {
      if (err) {
        res.status(500).send(err)
      }
    })
  )
}

const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`))

const io = socketIO().listen(server)

io.origins('*:*')
io.on('connection', socket => {
  socket.on('add', (...data) => socket.broadcast.emit('add', data[0]))
  socket.on('removeOne', (...data) => socket.broadcast.emit('removeOne', data[0]))
  socket.on('removeMany', (...data) => socket.broadcast.emit('removeMany', data[0]))
})
