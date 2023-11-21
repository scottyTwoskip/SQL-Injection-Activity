const http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//create a local SQL database in memory
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('asd', 'asd', 'Administrator')");
});

//get endpoint for homepage
app.get('/', function (req, res) {
    res.sendFile(index.html)
})
//Post loging endpoint
app.post('/login', function (req, res) {
    const username = req.body.username
    const password = req.body.password

    let query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "';"

    console.log(username)
    console.log(password)
    console.log(query)

    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
        }
    });

})


//listen on local port
app.listen(4001, function () {
    console.log('server listening on port 4001')
})