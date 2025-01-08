import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "./appConfig";
import { getAuthToken } from "./Auth";


export const fetchCartItemCount = createAsyncThunk(
    "cart/fetchCartItemCount",
  async () => {
    const token = getAuthToken();
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };
    const response = await axios.get(`${baseURL}/carts/cartItemCounts`, config);
    return response.data;
  }
)
  
const cartSlice = createSlice({
    name:"cart",
    initialState: {
        cartItemCount:0,
    },
    reducers : {
        setCartItemCount(state, action){
            state.cartItemCount = action.payload;
        },
        incrementCartItemCount(state, action){
            state.cartItemCount += action.payload;
        },
        decrementCartItemCount(state, action){
            state.cartItemCount -= action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartItemCount.fulfilled, (state, action) => {
          state.cartItemCount = action.payload;
        });
      },
});

export const {setCartItemCount, incrementCartItemCount, decrementCartItemCount} = cartSlice.actions;
export default cartSlice.reducer;