import React from "react";
import { Medal } from "lucide-react";

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-2/12 bg-white shadow-lg rounded-lg p-4 border-l border-gray-400 fixed top-[50px] right-0 h-[calc(100vh-50px)] flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-1 mt-4">
        <Medal size={26} strokeWidth={2} /> Leaderboard
      </h3>

      {/* Table Section */}
      <div className="mt-2">
        <table className="w-full text-left border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">Name</th>
              <th className="border border-gray-400 px-2 py-1">Rating</th>
              <th className="border border-gray-400 px-2 py-1">Earned Money</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1">John Doe</td>
              <td className="border border-gray-400 px-2 py-1">4.8</td>
              <td className="border border-gray-400 px-2 py-1">$500</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1">Jane Smith</td>
              <td className="border border-gray-400 px-2 py-1">4.6</td>
              <td className="border border-gray-400 px-2 py-1">$450</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1">
                Alice Johnson
              </td>
              <td className="border border-gray-400 px-2 py-1">4.5</td>
              <td className="border border-gray-400 px-2 py-1">$400</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Feedback Section */}
      <div className="mt-20 flex flex-col p-3 bg-purple-100 rounded">
        <h4 className="text-md font-semibold mb-2">We value your feedback!</h4>
        <p className="mb-4">
          Please share your thoughts with us to help improve our service.
        </p>
        <button className="bg-purple-950 text-white rounded px-4 py-2 hover:bg-purple-900">
          Submit Feedback
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
