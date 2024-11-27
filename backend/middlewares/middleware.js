const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const middleware = express();

middleware.use(session({
    secret: 'dfdfdfd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

middleware.use(express.json());
middleware.use(express.urlencoded({
    extended: false
}));
middleware.use(cookieParser());

middleware.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

module.exports = middleware