'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3000;

const username = "foo";
const password = "bar";

app.set('views', './views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    console.log('cookies', req.cookies);
    console.log('session', req.session);
    res.render('home');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/login', (req, res) => {
    if(req.body.username === username && req.body.password === password){
        req.session.logged = true;
        res.redirect('/secret');
    } else {
        req.session.logged = false;
        res.redirect('/form');
    }
});

app.get('/secret', (req, res) => {
    if(req.session.logged === true){
        res.render('secret');
    } else {
        res.redirect('form');
    }
});

app.get('/logout', (req, res) => {
    req.session.logged = false;
    res.send('Bye!<br><a href="form">sign again<a/>');
});

app.get('/setCookie/:clr', (req, res) => {
    res.cookie('color', req.params.clr, { maxAge: 60*60*24*5, httpOnly: true });
    res.send('cookie set');
});

app.get('/getCookie', (req, res) => {
    console.log('cookies', req.cookies);
    res.send(`color is ${req.cookies.color}`);
});

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('color');
    console.log('cookies', req.cookies);
    res.send('delete cookie color');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
