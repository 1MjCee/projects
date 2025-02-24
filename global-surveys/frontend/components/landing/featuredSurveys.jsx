import SurveyCard from "./featuredSurveyCard";

export default function FeaturedSurveys() {
  const surveys = [
    {
      id: 1,
      title: "Consumer Preferences Survey",
      questions: 10,
      earnings: 10,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
    {
      id: 2,
      title: "Tech Usage Survey",
      questions: 15,
      earnings: 15,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Surveys
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      </div>
    </section>
  );
}
