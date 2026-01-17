import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

// Async Thunk to fetch orders (Admin Only)
export const fetchOrders = createAsyncThunk('adminOrders/fetchOrders',async(_,{rejectWithValue})=>{
    try {
         const response = await axios.get(`${API_URL}/api/admin/orders`,{
            headers:{Authorization:USER_TOKEN,},
         });
         return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
});

// update order delivery status (Admin Only)
export const updateOrderStatus = createAsyncThunk('adminOrders/updateOrderStatus',async({id,status},{rejectWithValue})=>{
    try {
       const response = await axios.put(`${API_URL}/api/admin/orders/${id}`,{status},{
            headers:{Authorization:USER_TOKEN,},
         });
         return response.data
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
});

// Async Thunk to delete order (Admin Only)
export const deleteOrder = createAsyncThunk('adminOrders/deleteOrder',async(id,{rejectWithValue})=>{
    try {
         await axios.delete(`${API_URL}/api/admin/orders/${id}`,{
            headers:{Authorization:USER_TOKEN,},
         });
         return id;
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
});


// adminOrderSlice
const adminOrderSlice = createSlice({
    name:'adminOrders',
    initialState:{
        orders:[],
        totalOrders:0,
        totalSales:0,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        // fetch all orders
        .addCase(fetchOrders.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchOrders.fulfilled , (state,action)=>{
            state.loading = false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length;
        
            // calculate total sales
            const totalSales = action.payload.reduce((acc,order)=>{
               return acc + order.totalPrice;
            },0);
            
            state.totalSales = totalSales;
        })
        .addCase(fetchOrders.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.payload.message;
        })
        // update order status 
        .addCase(updateOrderStatus.fulfilled , (state,action)=>{
            const updatedorder = action.payload;
            const orderIndex = state.orders.findIndex((order)=> order._id === updatedorder._id);
            if(orderIndex !== -1) {
                state.orders[orderIndex] = updatedorder;
            }
        })
        // delete order
        .addCase(deleteOrder.fulfilled , (state,action)=>{
            state.orders = state.orders.filter((order)=>order._id !== action.payload._id);
        });
    }
});


// adminOrderSlice
export default adminOrderSlice.reducer;



