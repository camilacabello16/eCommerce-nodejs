'use strict'

const mongoose = require('mongoose');
const _SECONDS = 5000;
const os = require('os');
const process = require('process');

//count connect
const countConnect = () => {
    const numberOfConnection = mongoose.connections.length;
    console.log('Number of connections: ', numberOfConnection);
}

//check overload connect
const checkOverload = () => {
    setInterval(() => {
        const numberOfConnection = mongoose.connections.length;
        const numberOfCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnections = numberOfCores * 5;

        console.log('Active connections: ', numberOfConnection);
        console.log('Memory usage: ', memoryUsage / 1024 / 1024, ' MB');

        if (numberOfConnection > maxConnections) {
            console.log('Connection overload detect');
        }
    }, _SECONDS) //monitor per 5 seconds
}

module.exports = { countConnect, checkOverload };