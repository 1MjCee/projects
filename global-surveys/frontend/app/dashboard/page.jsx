import AvailableSurveys from "@/components/surveys/AvailableSurveys";
import EarningsSummary from "@/components/surveys/EarningsSummary";
import CompletedSurveyList from "@/components/surveys/CompletedSurveyList";
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/Navbar";

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Surveys</h2>
        <AvailableSurveys />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Earnings</h2>
        <EarningsSummary total="50.00" />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Completed Surveys</h2>
        <CompletedSurveyList />
      </section>
    </div>
  );
}
