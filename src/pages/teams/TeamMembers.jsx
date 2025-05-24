import React from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function TeamMembers() {
  const members = [
    { id: 1, name: "Dawit Zewdu", role: "Admin", email: "Dawit@example.com" },
    {
      id: 2,
      name: "Michael Feleke",
      role: "Member",
      email: "michael@example.com",
    },
    {
      id: 3,
      name: "Tsegaye Talegngeta",
      role: "Member",
      email: "tsegaye@example.com",
    },
    {
      id: 4,
      name: "Smachew Gedefaw",
      role: "Member",
      email: "smachew@gmail.com",
    },
  ];

  return (
    <div className="flex flex-col text-white p-6 rounded-lg shadow-lg ">
      <div className="flex items-center justify-end  pb-4 mb-4">
        <button className="mt-4 p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
          <div className="flex items-center gap-1">
            <IoPeopleSharp className="mr-2 text-lg drop-shadow-sm" />
            <span>Invite Members</span>
          </div>
        </button>
      </div>

      <table className="w-full table-auto text-left border border-gray-600">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-800">
            <th className="py-2 px-4 border-r border-gray-600">Name</th>
            <th className="py-2 px-4 border-r border-gray-600">Role</th>
            <th className="py-2 px-4 border-r border-gray-600">Email</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className=" border-b border-gray-600">
              <td className="py-2 px-4 border-r border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 bg-gray-800 rounded-full"></div>
                  <span>{member.name}</span>
                </div>
              </td>{" "}
              <td className="py-2 px-4 border-r border-gray-600">
                {member.role}
              </td>
              <td className="py-2 px-4 border-r border-gray-600">
                {member.email}
              </td>
              <td className="py-2 px-4 flex gap-2 items-center">
                <button
                  className="text-green-500 bg-slate-500 bg-opacity-40  rounded-md transition-all duration-300 hover:bg-green-500 hover:text-slate-50"
                  onClick={() => openEditor("open", project.lngName, project)}
                >
                  <FaEdit size={14} />
                </button>
                <button
                  className="text-red-500 bg-slate-500 bg-opacity-40  rounded-md transition-all duration-300 hover:bg-red-500 hover:text-red-50"
                  onClick={() => setIsDeleting(true)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamMembers;
