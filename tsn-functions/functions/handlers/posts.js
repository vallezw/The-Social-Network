const { db } = require('../util/admin');

// Fetch all Posts
exports.getAllPosts = (request, response) => {
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
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        })
      })
      return response.json(posts)
    })
    .catch((err) => console.error(err))
}

// Create a Post
exports.postOnePost =  (request, response) => {
  const newPost = {
    body: request.body.body,
    userHandle: request.user.handle,
    userImage: request.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  }

  db
    .collection("Posts")
    .add(newPost)
    .then(doc => {
      const resPost = newPost
      resPost.postId = doc.id
      response.json(resPost)
    })
    .catch(err => {
      response.status(500).json({ error: 'something went wrong'})
      console.error(err);
    })
}
// Fetch one scream
exports.getPost = (req, res) => {
  let postData = {}
  db.doc(`/Posts/${req.params.postId}`).get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({error: 'Post not found'})
      }
      postData = doc.data()
      postData.postId = doc.id
      return db.collection('Comments').orderBy('createdAt', 'desc').where('postId', '==', req.params.postId).get()
    })
    .then(data => {
      postData.comments = []
      data.forEach(doc => {
        postData.comments.push(doc.data())
      })
      return res.json(postData)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err.code})
    })
}

// Comment on a comment
exports.commentOnPost = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty.'})

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  db.doc(`/Posts/${req.params.postId}`).get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({error: 'Post not found'})
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1})
    })
    .then(() => {
      return db.collection('Comments').add(newComment)
    })
    .then(() => {
      res.json(newComment)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'})
    })
}

// Like a post
exports.likePost = (req, res) => {
  const likeDocument = db.collection('Likes').where('userHandle', '==', req.user.handle).where('postId', '==', req.params.postId).limit(1)

  const postDocument = db.doc(`/Posts/${req.params.postId}`)

  let postdata

  postDocument.get()
    .then(doc => {
      if(doc.exists){
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      }
      return res.status(404).json({error: `Post not found`})
    })
    .then(data => {
      if(data.empty){
        return db.collection('Likes').add({
          postId: req.params.postId,
          userHandle: req.user.handle
        })
        .then(() => {
          postData.likeCount++
          return postDocument.update({ likeCount: postData.likeCount })
        })
        .then(() => {
          return res.json(postData)
        })
      }
      else{
        return res.status(400).json({ error: 'Post already liked'})
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code})
    })
}

// Unlike a Post
exports.unlikePost = (req, res) => {
  const likeDocument = db.collection('Likes').where('userHandle', '==', req.user.handle).where('postId', '==', req.params.postId).limit(1)

  const postDocument = db.doc(`/Posts/${req.params.postId}`)

  let postdata

  postDocument.get()
    .then(doc => {
      if(doc.exists){
        postData = doc.data()
        postData.postId = doc.id
        return likeDocument.get()
      }
      return res.status(404).json({error: `Post not found`})
    })
    .then(data => {
      if(data.empty){
        return res.status(400).json({ error: 'Post not liked'})
      }
      else{
        return db.doc(`Likes/${data.docs[0].id}`).delete()
          .then(() => {
            postData.likeCount--
            return postDocument.update({ likeCount: postData.likeCount})
          })
          .then(() => {
            return res.json({postData})
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code})
    })
}

// Delete a post
exports.deletePost = (req, res) => {
  const document = db.doc(`/Posts/${req.params.postId}`)
  document.get()
    .then(doc => {
      console.log(doc);
      if(!doc.exists){
       return res.status(404).json({ error: 'Post not found'})
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized'})
      }
      return document.delete()
    })
    .then(() => {
      res.json({ message: 'Post deleted successfully'})
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code})
    })
}
