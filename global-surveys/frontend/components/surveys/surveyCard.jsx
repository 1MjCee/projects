export default function SurveyCard({ title, description }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Start Survey
      </button>
    </div>
  );
}
