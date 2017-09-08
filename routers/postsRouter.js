'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Post, RequiredFields } = require('../models/postModel');
const authorProps = ['lastName', 'firstName'];

/////////////////////////////////////////////////////////////////////
// GE - Read Records
/////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////
// POST - Create Record
/////////////////////////////////////////////////////////////////////
router.post('/', jsonParser, (req,res) => {
  for ( let i = 0; i < RequiredFields.length; i++ ) {
    const field = RequiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).json({message:message});
    }
    else if ( field === 'author' ){
      for( let j = 0; j < authorProps.length; j ++ ){
        const prop = authorProps[j];
        try {
          if (!(prop in req.body.author)) {
            const message = `Missing ${field}.${prop} in request body`;
            console.error(message);
            return res.status(400).json({message:message});
          }
        } catch (error) {
          const message = `Improper ${field} in request body`;
          console.error(message);
          return res.status(400).json({message:message});
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

/////////////////////////////////////////////////////////////////////
// PUT - Update Record
/////////////////////////////////////////////////////////////////////
router.put('/:id', jsonParser, (req,res) => {
  if (!( req.params.id && req.body.id && req.params.id === req.body.id )){
    const message = `Request path id ${req.params.id} does` +
                    ` not match body id ${req.body.id}`;
    console.error(message);
    return res.status(400).json({message:message});
  }
  const toUpdate = {};
  const updateableFields = RequiredFields.slice(0);
  for( let i = 0; i < updateableFields.length; i++ ) {
    const field = updateableFields[i];
    if(field in req.body){
      if ( field === 'author' ) {
        for( let j = 0; j < authorProps.length; j++ ) {
          const prop = authorProps[j];
          try {
            if (!(prop in req.body.author)) {
              const message = `Missing ${field}.${prop} in request body`;
              console.error(message);
              return res.status(400).json({message:message});
            }
          } catch (error) {
            const message = `Improper ${field} in request body`;
            console.error(message);
            return res.status(400).json({message:message});
          }
        }
      }
      toUpdate[field] = req.body[field];
    }
  }
  Post.findByIdAndUpdate(req.body.id, { $set: toUpdate })
    .then(post => {
      console.log(`Record updated : ${post._id}`)
      res.status(200).json({message:'Record updated'})
    })
    .catch(err => res.status(500).json({message:'Internal server error'}));
});

/////////////////////////////////////////////////////////////////////
// DELETE - Remove Record
/////////////////////////////////////////////////////////////////////
router.delete('/:id', jsonParser, (req,res) => {
  if (!( req.params.id && req.body.id && req.params.id === req.body.id )){
    const message = `Request path id ${req.params.id} does` +
                    ` not match body id ${req.body.id}`;
    console.error(message);
    return res.status(400).json({message:message});
  }
  Post.deleteOne({_id: req.params.id})
    .then(post => {
      console.log(`Record deleted: ${req.params.id}`)
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({message:'Internal server error'});
    });
});

module.exports = router;
