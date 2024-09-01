const express = require('express');             
const mongoose = require('mongoose');         
const cors = require('cors');

const app = express();                   
const papersRouter = require('./routes/papers');
const chatRouter = require('./routes/chat');
const path = require('path');


mongoose.connect("mongodb+srv://test:ZKQ3EgH3OuvKo5YN@mern-paper.lg9xb.mongodb.net/?retryWrites=true&w=majority&appName=MERN-paper", {           // Database connection
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("connected to DB"))
    .catch(console.error);


// Serve static files for default papertohtml styles
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  }));
app.use(express.json({ limit: '3mb' }));                                             
app.use('/api/papers', papersRouter);
app.use('/api/chat', chatRouter);

app.listen(3001, () => console.log("Server started on port 3001"));