const http = require('http');
const debug = require('debug')('nodeangular');
const app = require('./backend/app');

const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port > 0) return port;
    return false;
}

const onError = error => {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}` ;
    
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requer maiores privilégios`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${bind} está sendo usada em outro processo`);
            process.exit(1);
        default:
            throw error;
    }
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${port}` ;
    debug(`Servidor aberto na Porta ${bind}`);
}

const port = normalizePort(process.env.PORT || "3000");
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);