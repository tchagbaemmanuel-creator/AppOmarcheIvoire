import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from './store';
import { logIn, logOut } from '../slices/authSlice';
import { API_URL } from '@/config';

const mutex = new Mutex();

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    if (API_URL.includes('ngrok')) {
      headers.set('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Try to get a new token
        const refreshResult = await baseQuery(
          '/auth/refresh',
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Store the new token
          const data = refreshResult.data as { token: string; data: any };
          api.dispatch(logIn({ 
            token: data.token,
            user: data.data
          }));
          
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
          window.location.href = '/login';
        }
      } catch (error) {
        api.dispatch(logOut());
        window.location.href = '/login';
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseQueryWithRetry = baseQueryWithReauth;

// Type for extending the base API
export type BaseQuery = typeof baseQuery;
