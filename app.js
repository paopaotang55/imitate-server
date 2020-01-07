const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router')

app.use(bodyParser.json());
app.use(cors());

app.use("/", router);

app.listen(5000, () => { console.log('server run in 5000')})