import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
// MUI Stuff
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// Icons
import DeleteOutline from '@material-ui/icons/DeleteOutline'
// Redux Stuff

import { connect } from 'react-redux'
import { deletePost } from '../redux/actions/dataActions'
import { Tooltip, IconButton } from '@material-ui/core'

const styles = {
    deleteButton: {
        position: 'absolute',
        top: '10%',
        left: '90%'
    }
}

class DeletePost extends Component {
    
    state= {
        open: false
    }
    
    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    
    handleClose = () => {
        this.setState({
            open: false
        })
    }

    handleDelete = () => {
        this.props.deletePost(this.props.postId)
        this.handleClose()
    }


    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <Tooltip title="Delete Post">
                    <IconButton onClick={this.handleOpen} className={classes.deleteButton}>
                        <DeleteOutline />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete this post?
                    </DialogTitle>
                    <DialogContentText>
                        Once you press delete it is not reverseable.
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleDelete} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeletePost.propTypes = ({
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
})



export default connect(null, {deletePost})(withStyles(styles)(DeletePost))
