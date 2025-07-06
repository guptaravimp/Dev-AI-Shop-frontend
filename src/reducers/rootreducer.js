import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from '../slices/cartSlice'
import categorySlice from '../slices/categorySlice'
import authSlice from '../slices/authSlice'

const rootReducer=combineReducers({
    cart: cartSlice,
    category: categorySlice,
    auth: authSlice,
})

export default rootReducer