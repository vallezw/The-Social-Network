import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import Comments from './Comments'
import CommentForm from './CommentForm'
// MUI Stuff
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
// Icons
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import CloseIcon from '@material-ui/icons/Close'
import ChatIcon from '@material-ui/icons/Chat'
// Redux Stuff
import { connect } from 'react-redux'
import { getPost, clearErrors } from '../../redux/actions/dataActions'
import LikeButton from './LikeButton'

const styles = theme => ({
    ...theme.spreadThis,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton : {
        postion: 'absolute',
        left: '65%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
})



class PostDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen()
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname

        const { userHandle, postId } = this.props
        let newPath = `user/${userHandle}/post/${postId}`

        window.history.pushState(null, null, newPath)
       
        
        if(oldPath[0] === '/'){
            newPath = '/' + newPath
        }
        else if(newPath[0] === '/'){
            oldPath = '/' + oldPath
        }
        console.log(oldPath);
        console.log(newPath);
        if(oldPath === newPath) {
            oldPath = `/user/${userHandle}`
        }

        this.setState({ open: true, oldPath, newPath })
        this.props.getPost(this.props.postId)
    }
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath)
        this.setState({ open: false })
        this.props.clearErrors()
    }

    render(){
        const { classes, post: { comments, postId, body, createdAt, likeCount, commentCount, userImage, userHandle}, UI: { loading }} = this.props

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}/>
            </div>
        ) : (
            <Grid container spacing={5}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage} />
                </Grid>
                <Grid item sm={6}>
                    <Typography className={classes.userTitle} component={Link} color="primary" variant="h5" to={`/user/${userHandle}`}>
                        @{userHandle}
                    </Typography>
                    <Tooltip title="Close">
                        <IconButton onClick={this.handleClose} className={classes.closeButton}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton postId={postId} />
                    <span>{likeCount} Likes</span>
                    <Tooltip title="Comments">
                        <IconButton>
                            <ChatIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={classes.visibleSeparator}/>
                <CommentForm postId={postId} /> 
                <Comments comments={comments}/>
            </Grid>
        )


        return (
            <Fragment>
                <Tooltip title="Expand Post" className={classes.expandButton}>
                    <IconButton onClick={this.handleOpen}>
                        <UnfoldMore />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
})

const mapActionsToProps = {
    getPost,
    clearErrors
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog))