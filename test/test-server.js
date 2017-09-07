// Simple unit test to make sure the server starts and stops.
'use strict';

const chai = require('chai');
const should = chai.should();
const { runServer, closeServer } = require('../server');

describe( 'Start Server', function(){
  it('should start the server', function(){
    return runServer()
      .then(function(res){
        res.status.should.be.a('String');
        res.status.should.deep.equal('OK');
      });
  });
});

describe('Close Server', function(){
  it('should close the server', function() {
    return closeServer()
      .then(function(res){
        res.status.should.be.a('String');
        res.status.should.deep.equal('OK');
      });
  });
});