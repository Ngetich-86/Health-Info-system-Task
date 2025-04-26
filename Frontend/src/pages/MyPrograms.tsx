import React from 'react';
import { useGetUserEnrollmentsQuery } from '../features/healthPrograms/programAPI';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyPrograms: React.FC = () => {
  const { data: enrollments, isLoading, error } = useGetUserEnrollmentsQuery();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading your programs</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Programs</h1>
      
      {enrollments?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't enrolled in any programs yet.</p>
          <a href="/programs" className="text-teal-600 hover:text-teal-800 mt-2 inline-block">
            Browse available programs
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments?.map((enrollment) => (
            <div
              key={enrollment.programId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{enrollment.program.name}</h2>
              <p className="text-gray-600 mb-4">{enrollment.program.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-24">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    enrollment.program.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800'
                      : enrollment.program.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {enrollment.program.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-24">Duration:</span>
                  <span className="text-gray-700">{enrollment.program.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-24">Status:</span>
                  <span className="flex items-center">
                    {enrollment.isCompleted ? (
                      <>
                        <FaCheckCircle className="text-green-500 mr-1" />
                        <span className="text-green-700">Completed</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-yellow-500 mr-1" />
                        <span className="text-yellow-700">In Progress</span>
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-24">Enrolled:</span>
                  <span className="text-gray-700">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrograms; 