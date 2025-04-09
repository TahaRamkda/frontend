import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import API from '@/utils/api.axios';
import { LOGINAPI, CHANGEPASSWORD } from '@/utils/apiConstants';
import handleError from '../utils/handleError';

const initialState = {
    authData: null,
    loading: false,
    error: null,
    message: '',
};

export const fetchLogin = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const loginUrl = `${LOGINAPI}?username=${email}&password=${password}`;
        const response = await API.get(loginUrl);

        if (response && response.status === 200) {
            const { result } = response.data;
            localStorage.setItem("permission", JSON.stringify(result.permission));
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("tokenexpiry", result.refreshTokenExpiry);
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("clientId", result.clientId);
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("userName", result.userName);
            localStorage.setItem("isaxiomenabled", true);

            Cookies.set('permission', JSON.stringify(result.permission), { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('accessToken', result.accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', result.refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('clientId', result.clientId, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('userId', result.userId, { path: '/', secure: true, sameSite: 'Strict' });

            return result;
        } else {
            return rejectWithValue(response.message || 'An error occurred');
        }
    } catch (err) {
        console.log(err);
        //handleError(err);
        return rejectWithValue(err.response?.data.message || 'An error occurred');
    }
});

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (changePass, { rejectWithValue }) => {
        try {
            const response = await API.put(CHANGEPASSWORD, changePass);
            return response.data;
        } catch (error) {
            const handledError = handleError(error);
            return rejectWithValue(handledError);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        blankAuthState: (state) => {
            state.authData = null;
            state.error = null;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.pending, (state) => {
            state.loading = true;
            state.error = null; // Clear error on new request
        });
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.authData = action.payload;
            state.message = ''; // Clear message on successful login
        });
        builder.addCase(fetchLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.authData || 'Incorrect Username Or Passwords'; // Set error from payload
            state.message = state.error; // Optional: You might want to keep `message` as well
        });
        builder.addCase(changePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message || 'Changed Successfully';
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.message = action.payload?.message || action.error.message;
        });
    }
});

export const { blankAuthState } = authSlice.actions;
export default authSlice.reducer;
