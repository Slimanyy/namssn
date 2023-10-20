import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/v1/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
	endpoints(builder) {
		return {	
      // Make a user admin
      makeUserAdmin: builder.mutation({
        query(_id) {
          return {
            url: `${ADMIN_URL}/make-admin/${_id}`,
            method: 'PUT',
          };
        },
        invalidatesTags: ['User'],
      }),

      // Remove admin privileges from a user
      removeAdmin: builder.mutation({
        query(_id) {
          return {
            url: `${ADMIN_URL}/remove-admin/${_id}`,
            method: 'PUT',
          };
        },
        invalidatesTags: ['User'],
      }),

      // Get all payments
      getAllPayments: builder.query({
        query() {
          return {
            url: `${ADMIN_URL}/all-payments`,
            method: 'GET',
          };
        },
        providesTags: ['Payment'],
      }),
    }
  }
});

export const { useMakeUserAdminMutation, useRemoveAdminMutation, useGetAllPaymentsQuery } = adminApiSlice;