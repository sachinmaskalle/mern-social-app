import React from 'react';
import {connect} from 'react-redux';
import {Route,Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';


const privateRoutes = ({component: Component, auth: { isAuthenticated,loading}, ...rest}) => (
                        <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login' />) : 
                        (<Component {...props} />)} />);
                     

privateRoutes.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(privateRoutes);
