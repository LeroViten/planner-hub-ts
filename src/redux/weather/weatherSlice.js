import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
  }),
  endpoints: builder => ({
    getWeatherByName: builder.query({
      query: text => `?q=${text}&appid=7c511c1fd9bf88bf9a9d5d01c37e0441`,
    }),
  }),
});

export const { useGetWeatherByNameQuery } = weatherApi;
