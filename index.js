require("dotenv").config();
const mongoose = require('mongoose');

const app = require('./app');
const http = require('http').createServer(app);

const MONGO_URI= process.env.MONGO_URI;
const PORT= process.env.PORT;

const mondoconfig = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

mongoose.connect(MONGO_URI, mondoconfig).then(_ => console.log('MongoDB connected'));

http.listen(PORT, _ => console.log(`server is running on port ${PORT}`));