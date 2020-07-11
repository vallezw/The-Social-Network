import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
// MUI Stuff
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
// Redux Stuff
import { connect } from 'react-redux'
import {likePost, unlikePost} from '../redux/actions/dataActions'

export class LikeButton extends Component {
    likedPost = () => {        
        if(this.props.user.likes && this.props.user.likes.find(like => like.postId === this.props.postId)){
            return true
        }
        return false
    }
    likePost = () => {
        this.props.likePost(this.props.postId)
    }
    unlikePost = () => {
        this.props.unlikePost(this.props.postId)
    }
    render() {
        const { authenticated } = this.props.user
        const likeButton = !authenticated ? (
            <Tooltip title="Like">
                <Link to="/login">
                    <IconButton>
                        <FavoriteBorder color="primary"/>
                    </IconButton>
                </Link>
            </Tooltip>
        ) : (
            this.likedPost() ? (
                <Tooltip title="Unlike Post">
                    <IconButton onClick={this.unlikePost}>
                        <FavoriteIcon color="primary"/>
                    </IconButton>
                </Tooltip>
            ): (
                <Tooltip title="Like Post">
                    <IconButton onClick={this.likePost}>
                        <FavoriteBorder color="primary"/>
                    </IconButton>
                </Tooltip>
            )
        )

        return likeButton
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
