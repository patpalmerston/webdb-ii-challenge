const express = require(`express`);
const configureMiddleware = require('../config/middleware');

const zoosRouter = require('../routers/zoos-router.js');
const bearsRouter = require('../routers/bears-router.js')

const server = express();

configureMiddleware(server);


server.use('/api/zoos', zoosRouter);
server.use('/api/bears', bearsRouter)

module.exports = server;