"use strict";

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.disable('x-powered-by');

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/v1', require('./routes'));

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
