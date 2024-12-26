const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const initalState = {
    data:[],
    loading:false
}

export const fetchTestData = createAsyncThunk('test/fetchTestData', async () =>{
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const jsonData = await response.json();
        return jsonData;
    }catch(e){
        console.log(e);
    }
})


const testSlice = createSlice({
    name:"test",
    initialState:initalState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchTestData.pending,(state,{action}) =>{
            state.loading = true;
        })
        builder.addCase(fetchTestData.fulfilled,(state,action) => {
            state.loading = false;
            state.data = action.payload
        })
        builder.addCase(fetchTestData.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

// export {} = testSlice.actions

export default testSlice.reducer;