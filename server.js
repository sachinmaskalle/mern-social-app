const express = require('express');

const DEFAULT_PORT = 5000;
const port = process.env.PORT || DEFAULT_PORT;

const app = express();

app.listen(port, (req, res) => {
  console.log(`server started succssfully on port ${port}`);
});

//GET req
app.get('/', (req, res) => {
  res.send(`API data`);
});
