'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Post = require('../models/postModel');

router.get('/:id?', (req, res) => {

  if (req.params.id) {
    Post.find( { _id : req.params.id } )
      .then( post => {
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
        res.json({
          posts : posts.map(
            (p) => p.apiGet())
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

});

router.patch('/:id', jsonParser, (req,res) => {

});

router.delete('/:id', (req,res) => {

});

module.exports = router;
