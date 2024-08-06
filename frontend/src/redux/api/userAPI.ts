import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "sdsd" }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url:"new",
        method:"POST",
        body:user,
      }),
    }),
  }),
});
