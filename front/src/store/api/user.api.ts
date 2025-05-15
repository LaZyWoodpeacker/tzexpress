import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      { login?: string; token?: string; error?: string },
      { login: string; password: string }
    >({
      query: ({ login, password }) => ({
        url: "registration",
        method: "POST",
        body: { login, password },
      }),
    }),
    check: builder.query<
      { login?: string; token?: string; error?: string },
      {}
    >({
      query: () => ({
        url: "check",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }),
    }),
    auth: builder.mutation<
      { login?: string; token?: string; error?: string },
      { login: string; password: string }
    >({
      query: ({ login, password }) => ({
        url: "auth",
        method: "POST",
        body: { login, password },
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useCheckQuery, useAuthMutation } =
  userApi;
