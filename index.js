const server = require('./api/server');

const port = 9000;

// START YOUR SERVER HERE
console.log('hey you') 
server.listen(port, () => { 
    console.log('listening on', port); 
}); // end of server.listen
