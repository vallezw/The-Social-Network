import { SET_POSTS, LOADING_DATA, UNLIKE_POST, LIKE_POST, DELETE_POST, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, CREATE_POST, SET_POST, STOP_LOADING_UI, SUBMIT_COMMENT} from '../types'
import axios from 'axios'

// Get all Posts
export const getPosts = () => dispatch => {
    dispatch({ type: LOADING_DATA })
    axios.get('/posts')
        .then(res => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_POSTS,
                payload: []
            })
        })
}
// Create a post
export const createPost = (newPost) => (dispatch) => {
    dispatch({ type: LOADING_UI})
    axios.post('/createPost', newPost)
        .then(res => {
            dispatch({
                type: CREATE_POST,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getPost = (postId) => dispatch => {
    dispatch({ type: LOADING_UI})
    axios.get(`/post/${postId}`)
        .then(res => {
            dispatch({
                type: SET_POST,
                payload: res.data
            })
            dispatch({ type: STOP_LOADING_UI})
        })
        .catch(err => console.error(err))
}

// Like a post
export const likePost = (postId) => dispatch => {
    axios.get(`/post/${postId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            })
        })
        .catch(err => console.error(err))
}

// Unlike a psot
export const unlikePost = (postId) => dispatch => {
    axios.get(`/post/${postId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data.postData
            })
        })
        .catch(err => console.error(err))
}

// Submit a Comment
export const submitComment = (postId, commentData) => (dispatch) => {
    axios.post(`/post/${postId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            })
            dispatch(clearErrors())
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}


// Delete a Post
export const deletePost = (postId) => (dispatch) => {
    axios.delete(`/post/${postId}`)
        .then(() => {
            dispatch({ type: DELETE_POST, payload: postId})
        })
        .catch(err => console.error(err))
}

export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_UI })
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_POSTS,
                payload: res.data.posts
            })
        })
        .catch(() => {
            dispatch({
                type: SET_POSTS,
                payload: null
            })
        })
}

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS })
}