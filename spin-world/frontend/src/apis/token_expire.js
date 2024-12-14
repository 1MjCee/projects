import { jwtDecode } from "jwt-decode";

const isTokenExpiringSoon = (token, bufferTime = 300) => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp - currentTime < bufferTime;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return true;
  }
};

export default isTokenExpiringSoon;
