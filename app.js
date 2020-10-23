'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const cortesRuta = require('./src/controller/cortesController');

app.use(bodyParser.json());
//app.use('/api/auth', usuarioRutas);
app.use('/cortes/', cortesRuta);

app.listen(3000, function () {
  console.log('Express Server on port 3000!');
});