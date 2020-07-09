const functions = require('firebase-functions');

const express = require('express')
const exapp = express()

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

const { getAllPosts, postOnePost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');
// Post routes
exapp.get('/posts', getAllPosts)
exapp.post('/createPost', FBAuth, postOnePost)
exapp.get('/post/:postId', getPost)
exapp.delete('/post/:postId', FBAuth, deletePost)
exapp.get('/post/:postId/like', FBAuth, likePost)
exapp.get('/post/:postId/unlike', FBAuth, unlikePost)
exapp.post('/post/:postId/comment', FBAuth, commentOnPost)

// Users route
exapp.post('/signup', signup)
exapp.post('/login', login)
exapp.post('/user', FBAuth, addUserDetails)
exapp.get('/user', FBAuth, getAuthenticatedUser)
exapp.post('/user/image', FBAuth, uploadImage)
exapp.get('/user/:handle', getUserDetails)
exapp.post('/notifications', FBAuth, markNotificationsRead)

exports.api = functions.region('europe-west1').https.onRequest(exapp)

exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('Likes/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/Posts/${snapshot.data().postId}`).get()
      .then(doc=> {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/Notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            postId: doc.id
          })
        }
      })
      .catch(err => {
        console.error(err);
      })
  })

exports.deleteNotificationOnUnlike = functions.region('europe-west1').firestore.document('Like/{id}')
.onDelete((snapshot) => {
  return db.doc(`/Notifications/${snapshot.id}`)
    .delete()
    .catch(err => {
      console.error(err);
      return
    })
})

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('Comments/{id}')
.onCreate((snapshot) => {
  return db.doc(`/Posts/${snapshot.data().postId}`).get()
    .then(doc => {
      if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
        return db.doc(`/Notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'comment',
          read: false,
          postId: doc.id
        })
      }
    })
    .catch(err => {
      console.error(err);
      return
    })
})

exports.onUserimageChange = functions.region('europe-west1').firestore.document('/Users/{userId}')
  .onUpdate((change) => {
    if(change.before.data().imageUrl !== change.after.data().imageUrl){
      const batch = db.batch()
      return db.collection('Posts').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`Posts/${doc.id}`)
            batch.update(post, { userImage: change.after.data().iamgeUrl })
          })
          return batch.commit()
        })
    }
    else return true
  })

exports.onPostDelete= functions.region('europe-west1').firestore.document('Posts/{postId}')
.onDelete((snapshot, context) => {
  const postId = context.params.postId
  const batch = db.batch()
  return db.collection('Comments').where('postId', '==', postId).get()
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/Comments/${doc.id}`))
      })
      return db.collection('Likes').where('postId', '==', postId).get()
    })
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/Likes/${doc.id}`))
      })
      return db.collection('Notifications').where('postId', '==', postId).get()
    })
    .then(data => {
      data.forEach(doc => {
        batch.delete(db.doc(`/Notifications/${doc.id}`))
      })
      return batch.commit()
    })
    .catch(err => {
      console.error(err);
    })
})
