import SurveyCard from "./surveyCard";

export default function AvailableSurveys() {
  const dummySurveys = [
    { title: "Survey A", description: "This is survey A" },
    { title: "Survey B", description: "This is survey B" },
    { title: "Survey C", description: "This is survey C" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {dummySurveys.map((survey, index) => (
        <SurveyCard
          key={index}
          title={survey.title}
          description={survey.description}
        />
      ))}
    </div>
  );
}
