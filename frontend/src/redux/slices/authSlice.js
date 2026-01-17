import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from 'axios';

// Retriving user info and token from localStorage if available
const userFormStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

// Check for an existing guest ID in the localStorage or generate a new One
const initialGuestId = localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
localStorage.setItem('guestId',initialGuestId); // set new guestId or override the value

// Initial state
const initialState = {
    user:userFormStorage,
    guestId:initialGuestId,
    loading:false,
    error:null,
}

// Async Thunk for User Login
export const loginUser = createAsyncThunk('auth/loginUser', async (userData,{rejectWithValue})=>{
  try {
    // ${import.meta.env.VITE_BACKEND_URL}
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,userData);
    localStorage.setItem('userInfo',JSON.stringify(response.data.user));
    localStorage.setItem('userToken',response.data.token);
    return response.data.user; // Return the user object from the response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message || "Network Error" });
  }
});


// Async Thunk for User Registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData,{rejectWithValue})=>{
  try {
    // ${import.meta.env.VITE_BACKEND_URL}
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`,userData);
    localStorage.setItem('userInfo',JSON.stringify(response.data.user));
    localStorage.setItem('userToken',response.data.token);
    return response.data.user; // Return the user object from the response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message || "Network Error" });
  }
});

// Slice
const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers: {
    logout: (state) => {
        state.user = null,
        state.guestId = `guest_${new Date().getTime()}`; // reset guest if on logout
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        localStorage.setItem('guestId',state.guestId); // set new guest id in localstorage
    },
    generateNewGuestId : (state) => {
        state.guestId = `guest_${new Date().getTime()}`;
        localStorage.setItem('guestId',state.guestId);
  },
},
extraReducers: (builder) => {
 builder
    .addCase(loginUser.pending, (state) => {
       state.loading = true;
       state.error = null;
    })
     .addCase(loginUser.fulfilled, (state,action) => {
       state.loading = false;
       // state.error = action.payload
       state.user = action.payload;
    })
     .addCase(loginUser.rejected, (state,action) => {
        state.loading = false;
       state.error = action.payload?.message || action.error.message || "Something went wrong";
    })
     .addCase(registerUser.pending, (state) => {
       state.loading = true;
       state.error = null;
    })
     .addCase(registerUser.fulfilled, (state,action) => {
        state.loading = false;
        state.user = action.payload;
      //  state.error = action.payload;
    })
     .addCase(registerUser.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || "Something went wrong";
    })
}
});

export const {logout,generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;