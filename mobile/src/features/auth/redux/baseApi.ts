import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/redux/store';
import { ENV } from '@/config/constants';

export const baseQuery = fetchBaseQuery({
    baseUrl: ENV.API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        // Ngrok (plan gratuit) : sans ce header, la réponse peut être une page HTML
        // au lieu du JSON → échec login / RTK Query.
        if (ENV.API_URL.includes('ngrok')) {
            headers.set('ngrok-skip-browser-warning', 'true');
        }
        return headers;
    },
});
