import { createSlice } from "@reduxjs/toolkit";

interface NewsState {
  posts: string[];
}

const initialState: NewsState = {
  posts: [],
};

export const counterSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
});

export const {} = counterSlice.actions;

export default counterSlice.reducer;
