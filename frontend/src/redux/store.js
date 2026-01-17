import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import productReducer from './slices/productsSlice.js';
import cartReducer from './slices/cartSlice.js';
import checkoutReducer from './slices/checkoutSlice.js';
import orderReducer from './slices/orderSlice.js';
import adminUserReducer from './slices/adminUserSlice.js'
import adminProductReducer from './slices/adminProductSlice.js';
import adminOrderReducer from './slices/adminOrderSlice.js';

export const store = configureStore({
    reducer:{
        auth: authReducer,  // auth slice connect
        products:productReducer, // product slice connect
        cart:cartReducer, // cart slice connect
        checkout:checkoutReducer, // checkout slice connect
        orders:orderReducer, // order slice connect
        adminUser:adminUserReducer, // admin user slice connect
        adminProducts:adminProductReducer, // admin product connect
        adminOrders:adminOrderReducer, // admin order connect
    },
});