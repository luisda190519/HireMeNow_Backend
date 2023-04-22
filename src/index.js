require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('./db');
require('./passport/local-auth');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Configuracion
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000) 
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobApplication'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
