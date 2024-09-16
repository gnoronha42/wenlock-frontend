import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from '../../types/IUserState';
import { User } from '../../types/IUser';

const initialState: IUserState = {
  users: [],
  total: 0,
  isEditing: false, 
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setTotalUsers(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
      state.total += 1; 
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload; 
      }
    },

    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload; // Novo reducer
    },
  },
});

export const { setUsers, setTotalUsers, addUser, updateUser,setIsEditing } = userSlice.actions;
export default userSlice.reducer;