'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL } = require('./settings/config');

const app = express();
app.use(morgan('dev'));

let server;

function runServer( databaseUrl = DATABASE_URL, port = PORT ){
  app.locals.status = '';
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err){
        console.error(err);
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        app.locals.status = 'OK';
        resolve(app.locals);
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer(){
  app.locals.status = '';
  return mongoose.disconnect()
    .then( () => {
      return new Promise( (resolve, reject) => {
        console.log('Closing server.');
        server.close(err => {
          if (err){
            return reject(err);
          }
          app.locals.status = 'OK';
          resolve(app.locals);
        });
      });
    });
}

if (require.main === module){
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };