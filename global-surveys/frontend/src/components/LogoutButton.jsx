import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      // Handle error
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="danger" onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out…" : "Logout"}
      </Button>
    </>
  );
};

export default LogoutButton;
