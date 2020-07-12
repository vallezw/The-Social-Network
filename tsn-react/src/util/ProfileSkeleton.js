import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import NoImg from '../images/NoImg.png'
// MUI stuff
import Paper from '@material-ui/core/Paper'
// Icons
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';


const styles = theme => ({
    ...theme.spreadThis,
    handle: {
        height: 20,
        backgroundColor: '#e4e6e7',
        width: 200,
        margin: '0 auto 7px auto'
    },
    fullLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        marginBottom: 10
    },
    test: {
        height: 215,
        widht: 1000
    }

})

const ProfileSkeleton = (props) => {
    
    const { classes } = props

    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={NoImg} alt="profile" className="profile-image" />
                </div>
                <hr />
                <div className="profile-details">
                    <div className={classes.test}>
                        <div className={classes.handle}>
                            <div className={classes.handle} />
                            <hr />
                            <div className={classes.fullLine} />
                            <div className={classes.fullLine} />
                            <hr />
                            <LocationOnIcon /> <span>location</span>
                            <hr/>
                            <LinkIcon /> https://website.com
                            <hr />
                            <CalendarTodayIcon /> Joined date
                        </div>
                    </div>
                </div>
            </div>
        </Paper>
    )
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ProfileSkeleton)
