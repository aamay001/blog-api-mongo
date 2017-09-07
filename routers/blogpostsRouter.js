'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Post, RequiredFields } = require('../models/postModel');

router.get('/:id?', (req, res) => {

  if (req.params.id) {
    Post.find( { _id : req.params.id } )
      .then( post => {
        console.log('Sending single post');
        return res.json(post[0].apiGet());
      })
      .catch(
        err => {
          console.error(err);
          return res.status(500).json({message:'Internal server error'});
        }
      );
  }
  else {
    Post.find()
      .then( posts => {
        console.log('Sending all posts');
        res.json({
          posts : posts.map((p) => p.apiGet())
        });
      })
      .catch(
        err => {
          console.error(err);
          return res.status(500).json({message:'Internal server error'});
        }
      );
  }
});

router.post('/', jsonParser, (req,res) => {
  for ( let i = 0; i < RequiredFields.length; i++ ) {
    const field = RequiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
    else if ( field === 'author' ){
      let authorProps = ['lastName', 'firstName'];
      for( let j = 0; j < authorProps.length; j ++ ){
        const prop = authorProps[j];
        try {
          if (!(prop in req.body.author)) {
            const message = `Missing ${field}.${prop} in request body`;
            console.error(message);
            return res.status(400).send(message);
          }
        } catch (error) {
          const message = `Improper ${field} in request body`;
          console.error(message);
          return res.status(400).send(message);
        }
      }
    }
  }

  Post.create({
    title: req.body.title,
    content: req.body.content,
    author: {
      firstName: req.body.author.firstName,
      lastName: req.body.author.lastName
    },
    created: new Date()
  })
  .then( post => res.status(201).json(post.apiGet()))
  .catch( err => {
    console.error(err);
    res.status(500).json({message:'Internal server error'});
  });
});

router.patch('/:id', jsonParser, (req,res) => {

});

router.delete('/:id', (req,res) => {

});

module.exports = router;
