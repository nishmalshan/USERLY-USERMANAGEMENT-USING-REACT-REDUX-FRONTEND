import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  users: [],
  isLoading: false,
  error: null,
  isBlocked: false
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchUserStatusBlocked: (state) => {
      state.isLoading = false;
      state.error = null;
      state.users = null;
    },
    blockAndUnblockSuccess: (state, action) =>{
      const { userId, isBlocked } = action.payload;
      state.users = state.users.map(user =>
      user._id === userId ? { ...user, isBlocked } : user
  );
    }
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  blockAndUnblockSuccess,
  fetchUserStatusBlocked
} = usersSlice.actions;

export default usersSlice.reducer;