import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
// Redux Stuff
import { connect } from 'react-redux'
import { createPost, clearErrors } from '../../redux/actions/dataActions'
// MUI Stuff
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({
    ...theme.spreadThis,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    }
})

class CreatePost extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: ''})
            this.setState({
                open: false
            })
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
    }
    
    handleClose = () => {
        this.props.clearErrors()
        this.setState({ open: false, errors: {} })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.createPost({ body: this.state.body })
    }

    render() {
        const { errors } = this.state
        const { classes, UI: { loading }} = this.props
        return (
            <Fragment>
                <Tooltip title="Create a Post!">
                    <IconButton onClick={this.handleOpen}>
                        <AddIcon color="primary"/>
                    </IconButton>
              </Tooltip>
              <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                <Tooltip title="Close">
                    <IconButton onClick={this.handleClose} className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <DialogTitle>
                    Create a new post
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.handleSubmit}>
                        <TextField 
                            name="body" 
                            type="text" 
                            label="Your Post" 
                            multiline 
                            rows="3" 
                            placeholder="What do you want to tell people?" 
                            error={errors.body ? true : false} 
                            helperText={errors.body} 
                            className={classes.textField} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <Button type="submit" color="primary" className={classes.submitButton} disabled={loading}>
                            Post
                            {loading && (
                                <CircularProgress size={30} className={classes.progressSpinner}/>
                            )}
                        </Button>
                    </form>
                </DialogContent>
              </Dialog>
            </Fragment>
        )
    }
}

CreatePost.propTypes = {
    createPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI
})


export default connect(mapStateToProps, {createPost, clearErrors})(withStyles(styles)(CreatePost))




