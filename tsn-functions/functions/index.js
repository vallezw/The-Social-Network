const functions = require('firebase-functions');
const admine = require('firebase-admin')

var admin = require('firebase-admin');
var app = admin.initializeApp();

const express = require('express')
const exapp = express()

var firebaseConfig = {
    apiKey: "AIzaSyAsyZIH8Dz7MK63wmJFRAxFEd9ZaR8uq-g",
    authDomain: "the-social-network-c6953.firebaseapp.com",
    databaseURL: "https://the-social-network-c6953.firebaseio.com",
    projectId: "the-social-network-c6953",
    storageBucket: "the-social-network-c6953.appspot.com",
    messagingSenderId: "91832711976",
    appId: "1:91832711976:web:14779826c79a395411ee1d",
    measurementId: "G-TWCZW93T58"
  };

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const db = admin.firestore()

exapp.get('/posts', (request, response) => {
  db
    .collection("Posts")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let posts = []
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
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

  db
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

// Signup route
exapp.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  }

  let token, userId


  db.doc("/Users/" + newUser.handle)
    .get()
    .then(doc => {
      if(doc.exists){
        return response.status(400).json({ handle: "This handle is already taken"})
      }
      else{
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      }
      return db.doc(`/Users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token })
    })
    .catch(err => {
      console.log(err);
      if(err.code === "auth/email-already-in-use"){
        return response.status(400).json({ email: "Email is already in use"})
      }
      else{
          return response.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.region('europe-west1').https.onRequest(exapp)
