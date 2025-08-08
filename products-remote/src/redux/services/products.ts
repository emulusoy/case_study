
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { Product } from '../../types/Product';

// export const productsApi = createApi({
//   reducerPath: 'productsApi',
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
//   endpoints: (builder) => ({
//     getProducts: builder.query<Product[], void>({
//       query: () => '/products',
//     }),
//   }),
// });

// export const { useGetProductsQuery } = productsApi;


// products-remote/src/redux/services/products.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../types/Product';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    getCategories: builder.query<string[], void>({
      query: () => '/products/categories',
    }),
    getProductsByCategory: builder.query<Product[], string>({
      query: (category) => `/products/category/${encodeURIComponent(category)}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;

