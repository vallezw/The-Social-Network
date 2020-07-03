const functions = require('firebase-functions');
const admine = require('firebase-admin')

var admin = require('firebase-admin');
var app = admin.initializeApp();

const express = require('express')
const exapp = express()

exapp.get('/posts', (request, response) => {
  admin
    .firestore()
    .collection("Posts")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let posts = []
      data.forEach(doc => {
        posts.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        })
      })
      return response.json(posts)
    })
    .catch((err) => console.error(err))
})

exapp.post('/createPost', (request, response) => {
  const newPost = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString()
  }

  admin.firestore()
    .collection("Posts")
    .add(newPost)
    .then(doc => {
      response.json({ message: "document " + doc.id + " created successfully"})
    })
    .catch(err => {
      response.status(500).json({ error: 'something went wrong'})
      console.log(err);
    })
})

exports.api = functions.region('europe-west1').https.onRequest(exapp)
