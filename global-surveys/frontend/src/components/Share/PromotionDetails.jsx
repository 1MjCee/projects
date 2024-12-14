import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRankings } from "../../store/slices/RankingSlice";
import { Container, Card } from "react-bootstrap";
import { GiLevelFour } from "react-icons/gi";

const PromotionDetails = () => {
  const dispatch = useDispatch();

  // Accessing all rankings from Redux state
  const { allRankings, status } = useSelector((state) => state.ranking);

  // Fetch all rankings when the component mounts
  useEffect(() => {
    dispatch(fetchAllRankings());
  }, [dispatch]);

  // Show loading message while data is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="mt-4">
      <Card style={{ backgroundColor: "#03002e", color: "#fafafa" }}>
        <Card.Body>
          <Card.Title
            as="h5"
            className="mb-2 text-center"
            style={{ color: "#fafafa" }}
          >
            Invite friends to Spin World, improve your rankings, and enjoy
            exclusive benefits
          </Card.Title>

          {allRankings.length === 0 ? (
            <div
              className="text-center"
              style={{ color: "#FF8C00", fontWeight: "bold" }}
            >
              No ranking levels available yet.
            </div>
          ) : (
            allRankings.map((ranking, index) => {
              // Display details only if there are valid conditions (referrals or spending)
              if (
                ranking.minimum_referrals >= 0 ||
                ranking.minimum_spending >= 0
              ) {
                return (
                  <div
                    style={{ backgroundColor: "#010048" }}
                    key={ranking.ranking}
                    className="mb-2"
                  >
                    {/* Displaying the formatted promotion message */}
                    <div
                      className="p-3 text-center"
                      style={{
                        borderRadius: "5px",
                        color: "#03002e",
                      }}
                    >
                      <h5 style={{ color: "#fafafa" }}>{ranking.name}</h5>
                      <hr style={{ border: "1px solid #DA9100" }} />
                      <p style={{ color: "#DA9100" }}>
                        You need to have at least{" "}
                        {ranking.minimum_referrals >= 0
                          ? ranking.minimum_referrals
                          : "N/A"}{" "}
                        referrals or spend at least USD{" "}
                        {ranking.minimum_spending >= 0
                          ? ranking.minimum_spending
                          : "N/A"}{" "}
                        to gain <strong>{ranking.name}</strong> Ranking status.
                      </p>
                      <p style={{ color: "#DA9100" }}>
                        As a <strong>{ranking.name}</strong>, you will get{" "}
                        {ranking.max_spins > 0 ? ranking.max_spins : "N/A"}{" "}
                        spins to stand a chance to win more money.
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PromotionDetails;
