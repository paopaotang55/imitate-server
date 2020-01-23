const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(cors({
//     origin: ['http://hocalhost:3001'],
//     methods: ['GET', 'POST'],
//     credentials: trues
// }))

app.use("/", router);

app.listen(8000, () => {
  console.log("server on 8000");
});
