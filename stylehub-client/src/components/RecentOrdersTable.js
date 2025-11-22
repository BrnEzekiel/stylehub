import React from 'react';

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      {orders && orders.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Order ID</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id || index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-sm text-gray-700">{order.id}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{order.customer}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{order.amount}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
          <p>No recent orders to display.</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;

