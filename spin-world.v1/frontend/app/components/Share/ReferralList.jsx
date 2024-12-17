import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReferralList } from "../../store/slices/ReferralListSlice";
import { Table, Alert, Spinner, Pagination } from "react-bootstrap"; // Import React Bootstrap components

const ReferralList = () => {
  const dispatch = useDispatch();
  const referrals = useSelector((state) => state.referralList.referrals);
  const referralListStatus = useSelector((state) => state.referralList.status);
  const error = useSelector((state) => state.referralList.error);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (referralListStatus === "idle") {
      dispatch(fetchReferralList());
    }
  }, [dispatch, referralListStatus]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(referrals.length / itemsPerPage);

  // Get the current referrals to display based on the current page
  const indexOfLastReferral = currentPage * itemsPerPage;
  const indexOfFirstReferral = indexOfLastReferral - itemsPerPage;
  const currentReferrals = referrals.slice(
    indexOfFirstReferral,
    indexOfLastReferral
  );

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle fast navigation
  const handleFastNavigation = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (referralListStatus === "loading") {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (referralListStatus === "failed") {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div>
      <h5 style={{ color: "#DA9100" }} className="text-center mt-3">
        Your Referral List
      </h5>

      {referrals.length === 0 ? (
        <Alert variant="info">No Referrals Yet</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive variant="primary">
            <thead style={{ backgroundColor: "#03002e" }}>
              <tr>
                <th>User Name</th>
                <th>City</th>
                <th>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {currentReferrals.map((referral) => (
                <tr key={referral.id}>
                  <td>{referral.referred.username}</td>
                  <td>
                    {referral.referred.country.city} -{" "}
                    {referral.referred.country.country}
                  </td>
                  <td>
                    {new Date(
                      referral.referred.date_joined
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.Prev onClick={() => handleFastNavigation("prev")} />
              <Pagination.First onClick={() => setCurrentPage(1)} />
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
              <Pagination.Next onClick={() => handleFastNavigation("next")} />
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralList;
