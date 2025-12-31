import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      // For washer authentication
      const washerAuth = localStorage.getItem('washerAuth');
      if (washerAuth) {
        const { token } = JSON.parse(washerAuth);
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      // For regular user authentication
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Packages', 'Dashboard', 'Customer'],
  endpoints: (builder) => ({
    // Package endpoints
    getPackages: builder.query({
      query: () => '/package/package',
      providesTags: ['Packages'],
    }),
    
    // Customer operations
    bulkExportTemplate: builder.query({
      query: () => ({
        url: '/customer/bulk/export-template',
        responseHandler: (response) => response.blob(),
      }),
    }),
    bulkImport: builder.mutation({
      query: (formData) => ({
        url: '/customer/bulk/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Customer'],
    }),
    
    // Washer dashboard
    getWasherDashboard: builder.query({
      query: ({ washerId, date, apartment, carType }) => ({
        url: `/washer/dashboard/${washerId}`,
        params: {
          date,
          apartment: apartment !== 'all' ? apartment : undefined,
          carType: carType !== 'all' ? carType : undefined
        }
      }),
      providesTags: (result, error, arg) => [
        'Dashboard',
        ...(result?.customers || []).map(customer => ({ type: 'Customer', id: customer._id }))
      ],
    }),
    completeWash: builder.mutation({
      query: (data) => ({
        url: '/customer/complete-wash',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        'Dashboard',
        { type: 'Customer', id: customerId }
      ],
    }),

    // Revert / cancel a completed wash
    cancelWash: builder.mutation({
      query: (washId) => ({
        url: `/washlog/${washId}/cancel`,
        method: 'POST'
      }),
      invalidatesTags: ['Dashboard', 'Customer']
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPackagesQuery,
  useBulkExportTemplateQuery,
  useBulkImportMutation,
  useGetWasherDashboardQuery,
  useCompleteWashMutation,
  useCancelWashMutation
} = apiSlice;