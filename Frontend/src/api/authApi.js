import api from "./axios";

export const registerUser = (data) => {
    return api.post("/auth/signup", data);
};

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};