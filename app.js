var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});


// 電影台詞
db.run('CREATE TABLE IF NOT EXISTS movie_quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, movie_name TEXT NOT NULL, quote TEXT NOT NULL, vote_count INTEGER DEFAULT 0)');

app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM movie_quotes', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});

app.get('/api', (req, res) => {
    let provider = req.query.provider;
    let sql = 'SELECT * FROM movie_quotes WHERE provider = ?';
    db.all(sql, [provider], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(rows);
    });
});


app.post('/api', (req, res) => {
    let provider = req.body.provider;
    let sql = 'SELECT * FROM movie_quotes WHERE provider = ?';
    db.all(sql, [provider], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(rows);
    });
});



app.get('/api/insert', (req, res) => {
    let provider = req.query.provider;
    let movie_name = req.query.movie_name;
    let quote = req.query.quote;
    let sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});


app.post('/api/insert', (req, res) => {
    let provider = req.body.provider;
    let movie_name = req.body.movie_name;
    let quote = req.body.quote;
    let sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});


const cors = require("cors");
app.use(cors());



module.exports = app;








