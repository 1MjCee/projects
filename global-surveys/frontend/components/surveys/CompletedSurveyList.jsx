import CompletedSurveyItem from "./CompletedSurveyItem";

export default function CompletedSurveyList() {
  const dummySurveys = [
    { title: "Survey 1", date: "2023-10-01", reward: "5.00" },
    { title: "Survey 2", date: "2023-10-05", reward: "7.50" },
    { title: "Survey 3", date: "2023-10-10", reward: "10.00" },
  ];

  return (
    <div>
      {dummySurveys.map((survey, index) => (
        <CompletedSurveyItem
          key={index}
          title={survey.title}
          date={survey.date}
          reward={survey.reward}
        />
      ))}
    </div>
  );
}
