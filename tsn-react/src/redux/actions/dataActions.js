import { SET_POSTS, LOADING_DATA, UNLIKE_POST, LIKE_POST, DELETE_POST} from '../types'
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
                payload: res.data
            })
        })
        .catch(err => console.error(err))
}

// Delete a Post
export const deletePost = (postId) => (dispatch) => {
    axios.delete(`/post/${postId}`)
        .then(() => {
            dispatch({ type: DELETE_POST, payload: postId})
        })
        .catch(err => console.error(err))
}