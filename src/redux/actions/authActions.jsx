import axios from 'axios';
import toast from 'react-hot-toast';
import { loginStart, loginSuccess, loginFailure, signupStart, signupSuccess, signupFailure, logout, statusCheck } from "../slices/authSlice";
import { persistor } from '../store/store';
import { fetchUserStatusBlocked } from '../slices/usersSlice';


const API_URL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export const registerUser = (userData, navigate) => async (dispatch) => {
  dispatch(signupStart());
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    dispatch(signupSuccess());
    toast.success('Account created successfully!');
    navigate('/login');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(signupFailure(errorMessage));
    toast.error(errorMessage);
  }
};

export const loginUser = (userData, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API_URL}/login`, userData);

    if (response.data.success) {
      const user = response.data.user;
      if (!user) throw new Error('User data not found in response');
      if (user.role === 'user') {
        navigate('/');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      dispatch(loginSuccess({ user }));
      await persistor.flush(); // Force persistence to localStorage
      toast.success('Login successful!');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    toast.error(errorMessage);
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  dispatch(logout());
  await persistor.purge(); // Clear persisted data
  toast.success('Logged out successfully!');
  navigate('/login');
};


export const fetchUserStatus = (navigate) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/check-status`);

    dispatch(statusCheck({ isBlocked: response.data.isBlocked }));

    if (response.data.isBlocked) {
      fetchUserStatusBlocked();
      toast.error('Your account has been blocked');
      navigate('/login');
    }
  } catch (error) {
    const errorMessage = error.response?.isBlocked || 'Failed to check status';
    toast.error(errorMessage);
  }
};





