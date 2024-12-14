import { Link } from "react-router-dom";
import NoticeCard from "../components/Notices/NoticeCard";

const Notice = () => {
  const notices = [
    {
      id: 1,
      heading: "OMK Farm Notice",
      image: "https://poultryportal.com/uploads/image/2409/0a2f27b650eb69.jpg",
      summary:
        "Learn how Omk Farm works and how you can start making money through our investment opportunities.",
    },
    {
      id: 2,
      heading: "New Investment Opportunities",
      image: "https://poultryportal.com/uploads/image/2409/d37d73f30cd872.jpg",
      summary:
        "Discover new poultry products available for investment and their expected returns.",
    },
    // Add more notices as needed
  ];

  return (
    <div className="p-0">
      <h1>Notices</h1>
      <div className="notice-list">
        {notices.map((notice) => (
          <Link to={`/notices/${notice.id}`} key={notice.id}>
            <NoticeCard
              heading={notice.heading}
              image={notice.image}
              summary={notice.summary}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notice;
