const functions = require('firebase-functions');

const express = require('express')
const exapp = express()

const FBAuth = require('./util/fbAuth');

const { getAllPosts, postOnePost } = require('./handlers/posts');
const { signup, login } = require('./handlers/users');
// Post routes
exapp.get('/posts', getAllPosts)
exapp.post('/createPost', FBAuth, postOnePost)

// Users route
exapp.post('/signup', signup)
exapp.post('/login', login)

exports.api = functions.region('europe-west1').https.onRequest(exapp)
