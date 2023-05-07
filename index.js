const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();

const app = express()
const port = 5000;

app.use(cors());
app.use(express.json());

// Available routes
app.use('/api/auth',require("./Routes/Auth"));
app.use('/api/notes',require('./Routes/Notes'));

app.listen(port, () => {
  console.log(`my Notebook app listening on port ${port}`)
})