const functions = require('firebase-functions');

const express = require('express')
const exapp = express()

const FBAuth = require('./util/fbAuth');

const { getAllPosts, postOnePost, getPost, commentOnPost, likePost, unlikePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
// Post routes
exapp.get('/posts', getAllPosts)
exapp.post('/createPost', FBAuth, postOnePost)
exapp.get('/post/:postId', getPost)
// TODO: delete scream
exapp.get('/post/:postId/like', FBAuth, likePost)
exapp.get('/post/:postId/unlike', FBAuth, unlikePost)
exapp.post('/post/:postId/comment', FBAuth, commentOnPost)

// Users route
exapp.post('/signup', signup)
exapp.post('/login', login)
exapp.post('/user', FBAuth, addUserDetails)
exapp.get('/user', FBAuth, getAuthenticatedUser)
exapp.post('/user/image', FBAuth, uploadImage)

exports.api = functions.region('europe-west1').https.onRequest(exapp)
