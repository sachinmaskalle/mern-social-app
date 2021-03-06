import axios from 'axios';
import {setAlert} from '../actions/alert-action';
import {GET_PROFILE,GET_PROFILES,PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED} from '../actions/actionTypes';

const baseUrl = 'http://localhost:5000';

// Get current user profile
export const getCurrentUserProfile = () => async dispatch => {

    try {
        const res = await axios.get(`${baseUrl}/api/profile/me`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Get all profiles
export const getAllProfiless = () => async dispatch => {

    dispatch({
        type: CLEAR_PROFILE
    });

    try {
        const res = await axios.get(`${baseUrl}/api/profile`);

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Get profiles by Id
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`${baseUrl}/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Create or update profile
export const createProfile = (formData,history,edit=false) => async dispatch => {

    try {

        const config = {
            headers : {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post(`${baseUrl}/api/profile`, formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created','success'));

        if (!edit) {
            history.push('/dashboard');
        }

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

// Add Experience
export const addExperience = (formData,history) => async dispatch => {

    try {
        const config = {
            headers : {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put(`${baseUrl}/api/profile/experience`, formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        
        dispatch(setAlert('Experience Added', 'success'));

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

// Add Education
export const addEducation = (formData,history) => async dispatch => {

    try {
        const config = {
            headers : {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put(`${baseUrl}/api/profile/education`, formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

// Delete Experience
export const deleteExperience = (id) => async dispatch => {

    try {
        const res = await axios.delete(`${baseUrl}/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Removed', 'success'));
        
    } catch (err) {
        
        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

// Delete Education
export const deleteEducation = (id) => async dispatch => {

    try {
        
        const res = await axios.delete(`${baseUrl}/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Removed', 'success'));
        
    } catch (err) {

        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

// Delete Account & profile
export const deleteAccount  = () => async dispatch => {

  if(window.confirm("Are you sure ? This can not be undone!")) {
    try {
       
        await axios.delete(`${baseUrl}/api/profile`);

        dispatch({type: CLEAR_PROFILE});
        dispatch({type: ACCOUNT_DELETED});

        dispatch(setAlert('Your account has been permanantly deleted'));
        
    } catch (err) {

        dispatch({ 
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
  }
}