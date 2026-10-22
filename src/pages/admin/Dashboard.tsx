import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">Total Users: 120</div>
        <div className="bg-white p-6 rounded-xl shadow">Active Posts: 15</div>
        <div className="bg-white p-6 rounded-xl shadow">Total Herbs: 50</div>
      </div>
    </div>
  );
};
