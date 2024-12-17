import { useEffect, useState, useCallback } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../../../store/slices/UserSlice";

const ProfileInfo = () => {
  const dispatch = useDispatch();

  // Use memoized selector to prevent unnecessary re-renders
  const { userInfo, loading: userLoading } = useSelector((state) => state.user);

  // State initialization
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    avatarFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Fetch user info if it's not already available
  useEffect(() => {
    if (!userInfo && !userLoading) {
      dispatch(fetchUser());
    }
  }, [userInfo, userLoading, dispatch]);

  // Guard against undefined userInfo and set formData once userInfo is available
  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo?.username || "",
        email: userInfo?.email || "",
        avatar: userInfo?.avatar || "/assets/icons/avatar.png",
        avatarFile: null,
      });
    }
  }, [userInfo]);

  // Show alert message
  const showAlert = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatar: URL.createObjectURL(file),
      }));
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, avatarFile } = formData;

    if (!username || !email) {
      showAlert("Username and Email are required", "danger");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(
        updateUser({ userData: { username, email }, avatarFile })
      );
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        showAlert("Profile updated successfully!", "success");
      } else {
        showAlert("Error updating profile", "danger");
      }
    } catch {
      setLoading(false);
      showAlert("Error updating profile", "danger");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container fluid className="py-4 mt-5" style={{ background: "#03002e" }}>
      <div className="page-content defaultbg">
        {/* {message && <Alert variant={messageType}>{message}</Alert>} */}

        {/* Form */}
        <Form onSubmit={handleSubmit} style={{ fontSize: "14px" }}>
          <Row className="mb-4">
            <Col className="text-center">
              <Row className="mb-3">
                <Col xs={12}>
                  <img
                    src={formData.avatar}
                    id="upAvatar"
                    width="120"
                    height="120"
                    alt="Avatar"
                    className="rounded-circle"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                    id="avatarInput"
                  />
                  <label htmlFor="avatarInput" className="btn btn-primary mt-2">
                    Update Avatar
                  </label>
                </Col>
              </Row>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-light">Update Username</Form.Label>
            <Form.Control
              className="bg-light"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-light">Update Email</Form.Label>
            <Form.Control
              className="bg-light"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading || userLoading}
            className="mt-3 w-100"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ProfileInfo;
