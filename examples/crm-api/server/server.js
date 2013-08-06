var express = require('express'),
	app = express();

app.use(express.logger());
app.use(express.basicAuth('John', 'Doe'));
app.use(express.bodyParser());

app.get('/rest/customers', function(req, res) {
	res.send([
		{id: 1, name: 'John Doe', tags: ["picky"]},
		{id: 2, name: 'Jean Doe', tags: ["nice", "sexy"]}
	]);
});

app.post('/rest/customers', function(req, res) {
	res.send({id: 1, name: 'John Doe', tags: ["picky"]});
});

app.listen(3007);

console.log('Mock server listening at port 3007');
