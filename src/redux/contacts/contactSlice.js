import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../services/axiosBaseQuery';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://connections-api.herokuapp.com',
  }),
  tagTypes: ['Contact'],
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,

  endpoints(build) {
    return {
      fetchContacts: build.query({
        query: () => ({
          url: '/contacts',
          method: 'GET',
        }),
        providesTags: ['Contact'],
      }),

      createContact: build.mutation({
        query: newContact => ({
          url: '/contacts',
          method: 'POST',
          data: newContact,
        }),
        invalidatesTags: ['Contact'],
      }),

      editContact: build.mutation({
        query: updatedContact => ({
          url: `/contacts/${updatedContact.id}`,
          method: 'PATCH',
          data: {
            name: updatedContact.name,
            number: updatedContact.number,
          },
        }),
        invalidatesTags: ['Contact'],
      }),

      deleteContact: build.mutation({
        query: contactID => ({
          url: `/contacts/${contactID}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Contact'],
      }),
    };
  },
});

export const {
  useFetchContactsQuery,
  useDeleteContactMutation,
  useCreateContactMutation,
  useEditContactMutation,
} = contactApi;

//! fetchBaseQuery VARIANT!

// export const contactApi = createApi({
//   reducerPath: 'contactApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://connections-api.herokuapp.com',
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().authApi.auth.token; // or data
//       // const persistedToken = localStorage.getItem('token');
//       console.log(token);

//       // If we have a token set in state, let's assume that we should be passing it.
//       //   if (token) {
//       //     headers.set('authorization', `Bearer ${token}`);
//       //   }
//       // If we have a token in localStorage, lets use it:
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),
//   tagTypes: ['Contact'],
//   endpoints: builder => ({
//     fetchContacts: builder.query({
//       query: () => '/contacts',
//       providesTags: ['Contact'],
//     }),
//     deleteContact: builder.mutation({
//       query: contactId => ({
//         url: `/contacts/${contactId}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Contact'],
//     }),
//     createContact: builder.mutation({
//       query: newContact => ({
//         url: '/contacts',
//         method: 'POST',
//         data: newContact,
//       }),
//       invalidatesTags: ['Contact'],
//     }),
//   }),
// });
