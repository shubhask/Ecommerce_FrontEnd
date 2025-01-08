import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: "customer",
    initialState: null,
    reducers : {
        setCustomer(state, action) {
            return action.payload;
        },
        clearCustomer(){
            return null;
        }
    }
});

export const {setCustomer, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;