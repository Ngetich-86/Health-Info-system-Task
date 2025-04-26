import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import { RootState } from "../../app/store";

// Types
export interface HealthProgram {
  id: number;
  programId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive: boolean;
  createdAt: string;
}

export interface CreateProgramInput {
  name: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UpdateProgramInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive?: boolean;
}

export interface ProgramEnrollment {
  programId: string;
  userId: string;
  enrolledAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

// API Slice
export const programAPI = createApi({
  reducerPath: 'programAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Programs', 'Enrollments'],
  endpoints: (builder) => ({
    // Get all programs
    getAllPrograms: builder.query<HealthProgram[], void>({
      query: () => 'program',
      providesTags: ['Programs'],
    }),

    // Get active programs
    getActivePrograms: builder.query<HealthProgram[], void>({
      query: () => 'program/active',
      providesTags: ['Programs'],
    }),

    // Get programs by difficulty
    getProgramsByDifficulty: builder.query<HealthProgram[], string>({
      query: (difficulty) => `program/difficulty/${difficulty}`,
      providesTags: ['Programs'],
    }),

    // Get single program
    getProgram: builder.query<HealthProgram, string>({
      query: (programId) => `program/${programId}`,
      providesTags: (result, error, programId) => [{ type: 'Programs', id: programId }],
    }),

    // Create program
    createProgram: builder.mutation<HealthProgram, CreateProgramInput>({
      query: (programData) => ({
        url: 'program',
        method: 'POST',
        body: programData,
      }),
      invalidatesTags: ['Programs'],
    }),

    // Update program
    updateProgram: builder.mutation<HealthProgram, { programId: string; data: UpdateProgramInput }>({
      query: ({ programId, data }) => ({
        url: `program/${programId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { programId }) => [{ type: 'Programs', id: programId }],
    }),

    // Delete program
    deleteProgram: builder.mutation<void, string>({
      query: (programId) => ({
        url: `program/${programId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Programs'],
    }),

    // Toggle program status
    toggleProgramStatus: builder.mutation<HealthProgram, string>({
      query: (programId) => ({
        url: `program/${programId}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, programId) => [{ type: 'Programs', id: programId }],
    }),

    // Enroll in program
    enrollInProgram: builder.mutation<ProgramEnrollment, string>({
      query: (programId) => ({
        url: `program/${programId}/enroll`,
        method: 'POST',
      }),
      invalidatesTags: ['Enrollments'],
    }),

    // Get user enrollments
    getUserEnrollments: builder.query<ProgramEnrollment[], void>({
      query: () => 'program/enrollments',
      providesTags: ['Enrollments'],
    }),

    // Complete program
    completeProgram: builder.mutation<ProgramEnrollment, string>({
      query: (programId) => ({
        url: `program/${programId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Enrollments'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllProgramsQuery,
  useGetActiveProgramsQuery,
  useGetProgramsByDifficultyQuery,
  useGetProgramQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useToggleProgramStatusMutation,
  useEnrollInProgramMutation,
  useGetUserEnrollmentsQuery,
  useCompleteProgramMutation,
} = programAPI;
