import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';
import { AreaCode } from './market';

// DTOs
interface LoginDTO {
  email: string;
  password: string;
}

interface AdminLoginDTO extends LoginDTO {}

// Response Types
export interface Admin {
  adminId: string;
  areaCode: AreaCode | null;
  marketId?: string;
  email: string;
}

interface AuthResponse {
  data: Admin;
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AdminLoginDTO>({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/admin/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useLogoutMutation
} = authApi;
