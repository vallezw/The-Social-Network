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

const FBAuth = (request, response, next) => {
  let idToken
  if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')){
    idToken = request.headers.authorization.split('Bearer ')[1]
  }
  else {
    console.error('No token found\n' + request.headers.authorization);
    return response.status(403).json({error: 'Unauthorized'})
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      request.user = decodedToken
      return db.collection('Users')
        .where('userId', '==', request.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      request.user.handle = data.docs[0].data().handle
      return next()
    })
    .catch(err => {
      console.log('Error while verifying token', err);
      return response.status(403).json(err)
    })
}

exapp.post('/createPost', FBAuth, (request, response) => {
  const newPost = {
    body: request.body.body,
    userHandle: request.user.handle,
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
      console.error(err);
    })
})

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regEx)){
    return true
  }
  else{
    return false
  }
}

const isEmpty = (string) => {
  if(string.trim() === '') return true
  else return false
}

// Signup route
exapp.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  }

  let errors = {}

  if(isEmpty(newUser.email)){
    errors.email = 'Email must not be empty'
  }
  else if(!isEmail(newUser.email)){
    errors.email = 'Must be a valid email adress'
  }

  if(isEmpty(newUser.password)){
    errors.password = 'Must not be empty'
  }
  if(newUser.password !== newUser.confirmPassword){
    errors.confirmPassword = 'Password must match'
  }

  if(isEmpty(newUser.handle)){
    errors.handle = 'Must not be empty'
  }
  if(Object.keys(errors).length > 0){
    return response.status(400).json(errors)
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
      console.error(err);
      if(err.code === "auth/email-already-in-use"){
        return response.status(400).json({ email: "Email is already in use"})
      }
      else{
          return response.status(500).json({ error: err.code })
      }
    })
})


exapp.post('/login', (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  }

  let errors = {}

  if(isEmpty(user.email)) errors.email = 'Must not be empty'
  if(isEmpty(user.password)) errors.password = 'Must not be empty'

  if(Object.keys(errors).length > 0) return response.status(400).json(errors)

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return response.json({ token })
    })
    .catch(err => {
      if(err.code == "auth/wrong-password"){
        return response.status(403).json({ general: 'Wrong credentials, please try again'})
      }
      else {
        console.error(err);
        return response.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.region('europe-west1').https.onRequest(exapp)
