import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { logOut } from '../slices/authSlice';

export const authMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  // RTK Query uses `isRejectedWithValue` to determine if a request failed
  if (isRejectedWithValue(action)) {
    const { payload } = action;
    // Check if the error status is 401
    
    // @ts-ignore
    if (payload?.status === 401) {
      // Dispatch logout action
      dispatch(logOut());
    }
  }

  return next(action);
};
