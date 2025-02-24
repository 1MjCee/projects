export default function CompletedSurveyItem({ title, date, reward }) {
  return (
    <div className="p-4 bg-white rounded shadow mb-2">
      <h4 className="text-md font-semibold">{title}</h4>
      <p className="text-gray-600">Completed on: {date}</p>
      <p className="text-gray-600">Reward: ${reward}</p>
    </div>
  );
}
