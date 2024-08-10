const express = require('express');             // to handle api
const mongoose = require('mongoose');           // to handle database
const cors = require('cors');

const app = express();                          // setup express app
const papersRouter = require('./routes/papers');
const path = require('path');


mongoose.connect("mongodb://127.0.0.1:27017/mern-test", {           // Database connection
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("connected to DB"))
    .catch(console.error);


// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));


app.use(express.json());                        // allow us to use content type: 'application/json' inside our API
app.use(cors());                                // stop any cross origin errors we gets
app.use('/api/papers', papersRouter);


app.listen(3001, () => console.log("Server started on port 3001"));