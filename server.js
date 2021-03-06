const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());

app.use(require('./config/auth'));

app.use('/api/users', require('./routes/api/users'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const port = process.env.PORT || 3001;

const server = app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});

require('./io').attach(server);