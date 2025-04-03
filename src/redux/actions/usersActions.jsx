import axios from 'axios';
import { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure } from '../slices/usersSlice';


const API_URL = 'http://localhost:5000/admin';
axios.defaults.withCredentials = true;


export const fetchUsers = () => {
  return async (dispatch) => {
    dispatch(fetchUsersRequest());
    try {
      const response = await axios.get(`${API_URL}/dashboard`);

      dispatch(fetchUsersSuccess(response.data.users));
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(fetchUsersFailure(error.message || 'Failed to fetch users'));
    }
  };
};



