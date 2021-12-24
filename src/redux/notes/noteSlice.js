import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noteApi = createApi({
  reducerPath: 'noteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://617d4f611eadc5001713647b.mockapi.io/api/v1/',
  }),
  tagTypes: ['Note'],
  endpoints: builder => ({
    fetchNotes: builder.query({
      query: () => '/notes',
      providesTags: ['Note'],
    }),
    deleteNote: builder.mutation({
      query: noteId => ({
        url: `/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Note'],
    }),
    createNote: builder.mutation({
      query: ({ title, details, category }) => ({
        url: '/notes',
        method: 'POST',
        body: {
          title,
          details,
          category,
        },
      }),
      invalidatesTags: ['Note'],
    }),
    editNote: builder.mutation({
      query: ({ id, title, details, category }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: {
          title,
          details,
          category,
        },
      }),
      invalidatesTags: ['Note'],
    }),
  }),
});

export const {
  useFetchNotesQuery,
  useDeleteNoteMutation,
  useCreateNoteMutation,
  useEditNoteMutation,
} = noteApi;
