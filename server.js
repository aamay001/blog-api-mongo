'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL } = require('./settings/config');

const app = express();
app.use(morgan('dev'));

let server;

function runServer( databaseUrl = DATABASE_URL, port = PORT ){
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err){
        console.error(err);
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer(){
  return mongoose.disconnect()
    .then( () => {
      return new Promise( (resolve, reject) => {
        console.log('Closing server.');
        server.close(err => {
          if (err){
            return reject(err);
          }
          resolve();
        });
      });
    });
}

if (require.main === module){
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };