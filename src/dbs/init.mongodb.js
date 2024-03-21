'use strict'

const { countConnect } = require('../helpers/check.connect');
const { db: { host, port, name } } = require('../configs/config.mongodb');

const mongoose = require('mongoose');
const connectionString = `mongodb://${host}:${port}/${name}`;
console.log(connectionString);
class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(connectionString).then(() => {
            console.log('Connect to mongodb successfully');
            countConnect();
        }
        ).catch(err => console.log('Connect failed'));
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }
}

const mongodb = Database.getInstance();

module.exports = mongodb;
