const express = require('express');

const route = express.Router();

route.get('/', (req, res) => {
  res.send('Post API');
});

module.exports = route;
