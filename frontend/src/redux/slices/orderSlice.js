import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async Thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders',async(_,{getState,rejectWithValue})=>{
    try {
        const state = getState();
        const token = state.auth.user ? localStorage.getItem('userToken') : null;
        if (!token) throw new Error("No token found");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,{
            headers:{
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache",
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Async Thunk to fetch order details by ID
export const fetchOrderDetails = createAsyncThunk('orders/fetchOrderDetails',async(orderId,{rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,{
            headers: {
                Authorization:`Bearer ${localStorage.getItem('userToken')}`,
                "Cache-Control": "no-cache",
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// orderSlice
const orderSlice = createSlice({
    name:'orders',
    initialState : {
        orders:[],
        totalOrders:[],
        orderDetails:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // Fetch user orders
        .addCase(fetchUserOrders.pending , (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled , (state,action)=>{
            state.loading = false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length;
        })
        .addCase(fetchUserOrders.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch user orders';
        })
        // Fetch order details       
        .addCase(fetchOrderDetails.pending , (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled , (state,action)=>{
            state.loading = false;
            state.orderDetails = action.payload;
        })
        .addCase(fetchOrderDetails.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch user orders';
        })
    }
});


export default orderSlice.reducer;