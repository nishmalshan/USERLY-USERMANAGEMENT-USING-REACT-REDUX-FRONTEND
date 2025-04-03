import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchUsers } from '../../redux/actions/usersActions';
import { blockAndUnblockSuccess } from '../../redux/slices/usersSlice';
import { logoutUser } from '../../redux/actions/authActions';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const API_URL = 'http://localhost:5000/admin';
  axios.defaults.withCredentials = true;

  // Block user action
  const blockUser = async (userId) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/block`);
      if (response.data.success) {
        dispatch(blockAndUnblockSuccess({ userId, isBlocked: response.data.user.isBlocked }));
        toast.success('User blocked successfully');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error blocking user';
      toast.error(errorMessage);
    }
  };

  // Unblock user action
  const unblockUser = async (userId) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/unblock`);
      if (response.data.success) {
        dispatch(blockAndUnblockSuccess({ userId, isBlocked: response.data.user.isBlocked }));
        toast.success('User unblocked successfully');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error unblocking user';
      toast.error(errorMessage);
    }
  };

  const handleToggleBlockUser = (userId, isBlocked) => {
    if (isBlocked) {
      unblockUser(userId);
    } else {
      blockUser(userId);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  if (isLoading) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleBlockUser(user._id, user.isBlocked)}
                        disabled={isLoading}
                        className={`px-3 py-1 rounded ${
                          user.isBlocked
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm mt-6 px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;