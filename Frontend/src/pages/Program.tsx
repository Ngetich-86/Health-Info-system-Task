import React, { useState } from 'react';
import {
  useGetAllProgramsQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useToggleProgramStatusMutation,
  useEnrollInProgramMutation,
  useGetUserEnrollmentsQuery,
  HealthProgram,
  CreateProgramInput,
  UpdateProgramInput
} from '../features/healthPrograms/programAPI';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { UserState } from '../types/types';

const ProgramManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user as UserState);
  const isAdmin = user?.role === 'admin';
  
  const { data: programs, isLoading, error } = useGetAllProgramsQuery();
  const { data: userEnrollments } = useGetUserEnrollmentsQuery(undefined, {
    skip: isAdmin
  });
  const [createProgram] = useCreateProgramMutation();
  const [updateProgram] = useUpdateProgramMutation();
  const [deleteProgram] = useDeleteProgramMutation();
  const [toggleStatus] = useToggleProgramStatusMutation();
  const [enrollInProgram] = useEnrollInProgramMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<HealthProgram | null>(null);
  const [formData, setFormData] = useState<CreateProgramInput>({
    name: '',
    description: '',
    difficulty: 'Beginner',
    duration: '4 weeks'
  });

  const handleOpenDialog = (program?: HealthProgram) => {
    if (program) {
      setSelectedProgram(program);
      setFormData({
        name: program.name,
        description: program.description || '',
        difficulty: program.difficulty || 'Beginner',
        duration: program.duration || '4 weeks'
      });
    } else {
      setSelectedProgram(null);
      setFormData({
        name: '',
        description: '',
        difficulty: 'Beginner',
        duration: '4 weeks'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedProgram) {
        const updateData: UpdateProgramInput = {
          ...formData,
          isActive: selectedProgram.isActive
        };
        await updateProgram({ programId: selectedProgram.programId, data: updateData }).unwrap();
      } else {
        await createProgram(formData).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDelete = async (programId: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await deleteProgram(programId).unwrap();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleToggleStatus = async (programId: string) => {
    try {
      await toggleStatus(programId).unwrap();
    } catch (error) {
      console.error('Error toggling program status:', error);
    }
  };

  const handleEnroll = async (programId: string) => {
    try {
      await enrollInProgram(programId).unwrap();
    } catch (error) {
      console.error('Error enrolling in program:', error);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading programs</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Health Programs</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenDialog()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Program
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Difficulty</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs?.map((program) => {
              const isEnrolled = userEnrollments?.some(
                enrollment => enrollment.programId === program.programId
              );
              
              return (
                <tr key={program.programId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{program.name}</td>
                  <td className="py-3 px-4">{program.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      program.difficulty === 'Beginner'
                        ? 'bg-green-100 text-green-800'
                        : program.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {program.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4">{program.duration}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      program.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleOpenDialog(program)}
                            className="text-teal-600 hover:text-teal-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(program.programId)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Toggle Status"
                          >
                            <FaToggleOn />
                          </button>
                          <button
                            onClick={() => handleDelete(program.programId)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnroll(program.programId)}
                          disabled={isEnrolled || !program.isActive}
                          className={`${
                            isEnrolled
                              ? 'text-green-600 cursor-default'
                              : 'text-teal-600 hover:text-teal-800'
                          }`}
                          title={isEnrolled ? 'Already Enrolled' : 'Enroll in Program'}
                        >
                          {isEnrolled ? <FaUserCheck /> : <FaUserPlus />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedProgram ? 'Edit Program' : 'Add Program'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                {selectedProgram ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramManagement;
