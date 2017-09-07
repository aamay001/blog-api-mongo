'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

describe('Blog Posts - GET', function() {
  before(function(){
    return runServer();
  });

  after(function(){
    return closeServer();
  })

  it('should get all blog posts', function(){
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.posts.should.be.a('array');
        res.body.posts.length.should.be.above(1);
      });
  });

  it('should get a single blog post', function(){
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        const postId = res.body.posts[0].id;
        return chai.request(app)
          .get(`/blog-posts/${postId}`)
          .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.id.should.deep.equal(postId);
          });
      });
  });
});