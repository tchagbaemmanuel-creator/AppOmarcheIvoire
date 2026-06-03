import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '@/redux/store';
import { ENV } from '@/config/constants';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: ENV.API_URL,
    timeout: 90_000,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Accept', 'application/json');
        if (ENV.API_URL.includes('ngrok')) {
            headers.set('ngrok-skip-browser-warning', 'true');
        }
        return headers;
    },
});

/** Render gratuit : 1ère requête après veille peut échouer — une nouvelle tentative suffit souvent. */
export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    const retryable =
        result.error?.status === 'FETCH_ERROR' ||
        result.error?.status === 'PARSING_ERROR';
    if (retryable) {
        await new Promise((r) => setTimeout(r, 5000));
        result = await rawBaseQuery(args, api, extraOptions);
    }
    return result;
};
