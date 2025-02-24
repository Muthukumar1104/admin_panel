import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const UserTable = ({ users, onView, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.displayName.toLowerCase().includes(term) ||
      user.userPrincipalName.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div>
      <div className="mb-3 flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded pl-10 py-2 focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border text-left">Name</th>
              <th className="py-2 px-4 border text-left">Email</th>
              <th className="py-2 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="border hover:bg-gray-50">
                  <td className="py-2 px-4 border text-left">
                    {user.displayName}
                  </td>
                  <td className="py-2 px-4 border text-left">
                    {user.userPrincipalName}
                  </td>
                  <td className="py-2 px-4 flex justify-center space-x-3 text-lg">
                    <button onClick={() => onView(user)}>
                      <Eye
                        className="text-blue-500 hover:text-blue-700"
                        size={20}
                      />
                    </button>
                    <button onClick={() => onEdit(user)}>
                      <Edit
                        className="text-yellow-500 hover:text-yellow-700"
                        size={20}
                      />
                    </button>
                    <button onClick={() => onDelete(user)}>
                      <Trash2
                        className="text-red-500 hover:text-red-700"
                        size={20}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
