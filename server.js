const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const DEFAULT_PORT = 5000;
const port = process.env.PORT || DEFAULT_PORT;

const app = express();

// connect database
connectDb();

// Init middleware
app.use(express.json());

//CORS headers
app.use(cors({ origin: 'http://localhost:3000' }));

// Define Routes
app.use('/api/users', require('./routing/api/users'));
app.use('/api/posts', require('./routing/api/posts'));
app.use('/api/auth', require('./routing/api/auth'));
app.use('/api/profile', require('./routing/api/profile'));

app.listen(port, (req, res) => {
  console.log(`server started succssfully on port ${port}`);
});
