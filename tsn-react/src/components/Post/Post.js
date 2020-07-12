import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types'
import DeletePost from './DeletePost'
import LikeButton from './LikeButton'
import PostDialog from './PostDialog'
// MUI Imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'
// Icons
import ChatIcon from '@material-ui/icons/Chat'

// Redux Stuff
import { connect } from 'react-redux'

import { Tooltip, IconButton } from '@material-ui/core'

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image:{
        minWidth: 200
    },
    content:{
        padding: 25,
        objectFit: 'cover'
    }
}

export class Post extends Component {
    
    

    render() {
        dayjs.extend(relativeTime)
        const { classes, post: { body, createdAt, userImage, userHandle, postId, likeCount, commentCount}, 
        user: {
            authenticated,
            credentials: {handle}
        } 
        } = this.props        
        

        const deleteButton = authenticated && userHandle === handle ? (
            <DeletePost postId={postId}/>
        ) : null

        return (
            <Card className={classes.card}>
                <CardMedia
                image={userImage}
                title="Profile Image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/user/${userHandle}`} color="primary">{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>
                    <Tooltip title="Comments">
                        <IconButton>
                            <ChatIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <span>{commentCount} Comments</span>
                    <PostDialog postId={postId} userHandle={userHandle} />
                </CardContent>
            </Card>
        )
    }
}

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})




export default connect(mapStateToProps)(withStyles(styles)(Post))
