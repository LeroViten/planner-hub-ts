import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../services/axiosBaseQuery';

export const authApi = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://connections-api.herokuapp.com',
  }),
  endpoints(build) {
    return {
      fetchUser: build.query({
        query: () => ({
          url: '/users/current',
          method: 'GET',
        }),
      }),
      createUser: build.mutation({
        query: newUser => ({
          url: '/users/signup',
          method: 'POST',
          data: newUser,
        }),
      }),
      loginUser: build.mutation({
        query: loginData => ({
          url: '/users/login',
          method: 'POST',
          data: loginData,
        }),
      }),
      logoutUser: build.mutation({
        query: () => ({
          url: '/users/logout',
          method: 'POST',
        }),
      }),
    };
  },
});

export const {
  useFetchUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authApi;

//! fetchBaseQuery Version:

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://connections-api.herokuapp.com/',
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token; // or data

// If we have a token set in state, let's assume that we should be passing it.
//   if (token) {
//     headers.set('authorization', `Bearer ${token}`);
//   }
// If we have a token in localStorage, lets use it:
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   endpoints: builder => ({
//     fetchUser: builder.query({
//       query: () => `/users/current`,
//     }),
//     createUser: builder.mutation({
//       query: ({ name, email, password }) => ({
//         url: '/users/signup',
//         method: 'POST',
//         body: {
//           name,
//           email,
//           password,
//         },
//       }),
//     }),
//     loginUser: builder.mutation({
//       query: ({ email, password }) => ({
//         url: '/users/login',
//         method: 'POST',
//         body: {
//           email,
//           password,
//         },
//       }),
//     }),
//     logoutUser: builder.mutation({
//       query: () => ({
//         url: '/users/logout',
//         method: 'POST',
//       }),
//     }),
//   }),
// });
