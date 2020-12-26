const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');
// Sign user up
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
          return response.status(500).json({ general: 'Something went wrong, please try again.' })
      }
    })
}
// Log User in
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
      console.error(err);
      return response.status(500).json({ general: 'Wrong credentials, please try again'})
    })
}

// Add user addUserDetails
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body)

  db.doc(`/Users/${req.user.handle}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully'})
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
}
// Get any user's Details
exports.getUserDetails = (req, res) => {
  let userData = {}
  db.doc(`/Users/${req.params.handle}`).get()
    .then(doc => {
      if(doc.exists){
        userData.user = doc.data()
        return db.collection('Posts').where('userHandle', '==', req.params.handle)
          .orderBy('createdAt', 'desc')
          .get()
      }
      else {
        return res.status(404).json({ error: "User not found"})
      }
    })
    .then(data => {
      userData.posts = []
      data.forEach(doc => {
        userData.posts.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          postId: doc.id
        })
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}

// Get own User details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {}
  db.doc(`/Users/${req.user.handle}`).get()
    .then(doc => {
      if(doc.exists){
        userData.credentials = doc.data()
        return db.collection('Likes').where('userHandle', '==', req.user.handle).get()
      }
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data())
      })
      return db.collection('Notifications').where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get()
    })
    .then(data => {
      userData.notifications = []
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          postId: doc.data().postId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        })
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
}

// Upload a profile Image
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

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch()
  req.body.forEach(notificationId => {
    const notification = db.doc(`/Notifications/${notificationId}`)
    batch.update(notification, { read: true })
  })
  batch.commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}
