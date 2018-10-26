var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

var todos = [];
var nextId;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/**
 * APPLICATION ENDPOINTS
 * */
app.get('/todos', function (req, res) {
    res.end(JSON.stringify(todos));
});

app.post('/todos', function (req, res) {
    var newTodo = {
        id: nextId++,
        title: req.body.title,
        complete: false
    };

    todos.push(newTodo);

    res.end(JSON.stringify(newTodo));
});

app.put('/todos/:id', function (req, res) {
    var id = Number.parseInt(req.params.id);

    var todo = todos.filter(todo => todo.id === id)[0];
    var todoIndex = todos.indexOf(todo);
    todo.complete = !todo.complete;

    todos = [
        ...todos.slice(0, todoIndex),
        todo,
        ...todos.slice(todoIndex + 1)
    ];

    res.end(JSON.stringify(todo));
});

app.delete('/todos/:id', function (req, res) {
    var id = Number.parseInt(req.params.id);

    todos = todos.filter(todo => todo.id !== id);

    res.end();
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

    fs.readFile(__dirname + '/' + 'data.json', 'utf8', function (err, data) {
        var jsonData = JSON.parse(data);

        todos = jsonData.todos;
        nextId = jsonData.nextId;
    });
});
