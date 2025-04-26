import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery, useSearchUsersQuery } from '../features/users/usersAPI';
import { CompleteUser } from '../types/types';
import { FaSearch, FaUserPlus, FaEye, FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';

const Client = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin' | ''>('');
    const [selectedClient, setSelectedClient] = useState<CompleteUser | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { data: clients, isLoading: isLoadingClients } = useGetAllUsersQuery();
    const { data: searchResults, isLoading: isLoadingSearch } = useSearchUsersQuery(
        { query: searchQuery, role: selectedRole },
        { skip: !searchQuery && !selectedRole }
    );

    const displayedClients = searchQuery || selectedRole ? searchResults : clients;

    const handleViewClient = (client: CompleteUser) => {
        setSelectedClient(client);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedClient(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
                    <button
                        onClick={() => navigate('/clients/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        <FaUserPlus className="mr-2" />
                        Add New Client
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as 'patient' | 'doctor' | 'admin' | '')}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                        >
                            <option value="">All Roles</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                {/* Clients List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoadingClients || isLoadingSearch ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : displayedClients?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                            No clients found
                                        </td>
                                    </tr>
                                ) : (
                                    displayedClients?.map((client) => (
                                        <tr key={client.userId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={client.imageUrl || "/user-avatar.png"}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {client.profile?.firstName} {client.profile?.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    client.role === 'patient' ? 'bg-green-100 text-green-800' :
                                                    client.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {client.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    client.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {client.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleViewClient(client)}
                                                        className="text-teal-600 hover:text-teal-900"
                                                    >
                                                        <FaEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/clients/edit/${client.userId}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <FaEdit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/clients/programs/${client.userId}`)}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        <FaClipboardList className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* View Modal */}
                {isViewModalOpen && selectedClient && (
                    <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Client Details
                                            </h3>
                                            <div className="mt-4">
                                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                                    <div className="sm:col-span-1">
                                                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {selectedClient.profile?.firstName} {selectedClient.profile?.lastName}
                                                        </dd>
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{selectedClient.email}</dd>
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <dt className="text-sm font-medium text-gray-500">Role</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedClient.role}</dd>
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {selectedClient.isVerified ? 'Verified' : 'Pending Verification'}
                                                        </dd>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {selectedClient.profile?.phone || 'Not provided'}
                                                        </dd>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">
                                                            {selectedClient.profile?.address || 'Not provided'}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Client;