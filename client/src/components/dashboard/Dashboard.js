import React, {useEffect, Fragment} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentUserProfile, deleteAccount } from '../../actions/profile';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Experience from './Experience';
import Spinner from '../layout/Spinner';

const Dashboard = ({ getCurrentUserProfile,deleteAccount, auth:{user}, profile: {profile,loading} }) => {
    useEffect(() => {
        getCurrentUserProfile()
    },[getCurrentUserProfile]);

    return loading && profile === null ? (<Spinner />) : 
        (<Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
            <i className='fas fa-user'></i>
            Welcome &nbsp; {user && user.name}
        </p>
        { profile !== null ? 
            (<Fragment>
                <DashboardActions />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />

                <div className="my-2">
                    <button className="btn btn-danger btn-lg" onClick={() => deleteAccount()}>
                        <i className='fas fa-user-minus' /> Delete My Account
                    </button>
                </div>
            </Fragment>) : 
            
            (<Fragment>
            <p>You have not yet setup profile, Please add some info</p>
            <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
            </Fragment>)
        }
        </Fragment>)
    
    
}

Dashboard.propTypes = {
    getCurrentUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps,{ getCurrentUserProfile,deleteAccount })(Dashboard);
