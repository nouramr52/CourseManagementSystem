import api from "./axios.js";

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET /api/users/me — fetch the full logged-in user from the DB
export const getMe = () =>
    api.get("/users/me", { headers: authHeader() });
