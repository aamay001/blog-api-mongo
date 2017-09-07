'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,

  // Using Array purposely in case there are multiple authors.
  author: {
    firstName: String,
    lastName: String
  },

  created: Date
});

// Strings together all author names in a csv format.
postSchema.virtual('authorString').get( function() {
  return `${this.author.firstName} ${this.author.lastName}`;
  }
);

// This function will be used as the object
// representation when the server sends a json
// response of the object.
postSchema.methods.apiGet = function() {
  return {
    id : this._id,
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: ( this.created ? this.created.getTime() : (new Date()).getTime() )
  };
}

const Post = mongoose.model('Posts', postSchema);
const RequiredFields = [ 'title', 'content', 'author' ];

module.exports = { Post, RequiredFields };