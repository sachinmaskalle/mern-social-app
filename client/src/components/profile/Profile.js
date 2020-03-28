import React, { Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileById } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = ({ getProfileById, auth, profile: {loading,profile}, match}) => {

    useEffect(() => {
        getProfileById(match.params.id);
    },[getProfileById, match.params.id]);

    return (
        <Fragment>
            {
                profile === null || loading ? (<Spinner/>) : (<Fragment>
                    <Link to='/profiles' className='btn btn-light'>Back To Profiles</Link>
                    {
                        auth.isAuthenticated && auth.isLoading === false && 
                        auth.user.id === profile.user._id && (<Link to='/edit-profile' className='btn btn-dark'>Edit Profile</Link>)
                    }
                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile}/>
                        <ProfileAbout profile={profile}/>
                        <div className='profile-exp p-2 bg-white'>
                            <h2 className="text-primary">
                            <i className="fab fa-black-tie text-primary"></i> 
                                {' '} Experience
                            </h2>
                            {
                                profile.experience.length > 0 ? (<Fragment>
                                    {
                                    profile.experience.map(experience => (
                                        <ProfileExperience key={experience._id} experience={experience} />))
                                    }
                                </Fragment>
                                ) : <h4>No Experience Credentials</h4>
                            }
                        </div>
                        <div className='profile-edu p-2 bg-white'>
                            <h2 className="text-primary">
                            <i className="fas fa-graduation-cap"></i> 
                                {' '} Education
                            </h2>
                            {
                                profile.education.length > 0 ? (<Fragment>
                                    {
                                    profile.education.map(education => (
                                        <ProfileEducation key={education._id} education={education} />))
                                    }
                                </Fragment>
                                ) : <h4>No Education Credentials</h4>
                            }
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
