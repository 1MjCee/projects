export default function EarningsSummary({ total }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">Total Earnings</h3>
      <p className="text-2xl font-bold">${total}</p>
      <p className="text-gray-600">Earnings this month: $10.00</p>
    </div>
  );
}
