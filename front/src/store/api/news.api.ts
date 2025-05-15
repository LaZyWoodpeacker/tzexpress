import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/news" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getNews: builder.query<any, any>({
      query: () => ({
        url: "",
      }),
      providesTags: ["Posts"],
    }),
    getOneNews: builder.query<
      {
        error?: string;
        images?: { name: string; filename: string }[];
        text?: string;
        title?: string;
        author?: { login: string };
      },
      string
    >({
      query: (id?: string) => ({
        url: `/${id}`,
      }),
      providesTags: ["Posts"],
    }),
    addNews: builder.mutation<{ error?: string }, FormData>({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Posts"],
    }),
    changeNews: builder.mutation<{ id: string; form: FormData }, any>({
      query: ({ id, form }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: form,
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Posts"],
    }),
    deleteNews: builder.mutation<{ id: string }, any>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useAddNewsMutation,
  useGetNewsQuery,
  useGetOneNewsQuery,
  useChangeNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
