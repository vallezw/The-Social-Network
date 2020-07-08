const { db } = require('../util/admin');

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
          createdAt: doc.data().createdAt
        })
      })
      return response.json(posts)
    })
    .catch((err) => console.error(err))
}

exports.postOnePost =  (request, response) => {
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
  if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty.'})

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
