const http = require('http')

const server = http.createServer((req, res) => {
    console.log('Server is called');

    console.log(req.method);
    console.log(req.url);
    console.log(req.headers.host);

    res.writeHead(201, { // Response Status Code
        'CustomHeader': 'somevalue'
    });
    res.write('Hello from NodeJS Server!');
    res.end();
});

server.listen(5000);

console.log('Server is running on port 5000...........');