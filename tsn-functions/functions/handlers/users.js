const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const { validateSignupData, validateLoginData } = require('../util/validators');

exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  }

  const { valid, errors } = validateSignupData(newUser)

  if(!valid) return response.status(400).json(errors)

  const noImg = 'blank-profile-picture-973460_960_720.webp'

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
}

exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  }

  const { valid, errors } = validateLoginData(user)

  if(!valid) return response.status(400).json(errors)

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
}

exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers })

  let imageFileName
  let imageToBeUploaded = {}

  busboy.on('file', (fieldname, file, filename, encoding, mimetype ) => {
    if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
      return res.status(400).json({ error: 'Wrong file type submitted'})
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    imageFileName = Math.round(Math.random()*100000000000) + "." + imageExtension
    const filepath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = {filepath, mimetype}
    file.pipe(fs.createWriteStream(filepath))
  })
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
      return db.doc(`/Users/${req.user.handle}`).update({ imageUrl })
    })
    .then(() => {
      return res.json({message: 'Image uploaded successfully'})
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
  })
  busboy.end(req.rawBody)
}
