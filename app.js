// dependencies
require('dotenv').config();
const express = require('express');
const path = require('node:path'); 
const app = express();

// settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting up passport.js
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username },
            });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
        });
      done(null, user);
    } catch (err) {
      done(err);
    }
});

// persistent sessions in DB
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

// mounting routes
const indexRoute = require('./routes/indexRoute');
const uploadRoute = require('./routes/uploadRoute');
app.use('/', indexRoute);
app.use('/upload', uploadRoute);

// launch
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}!`)
});
