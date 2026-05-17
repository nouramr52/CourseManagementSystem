import api from "./axios";
import { getSupabase } from "../config/supabase";

export const registerUser = (data) => {
    return api.post("/auth/signup", data);
};

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const loginWithGoogle = async () => {
    const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    if (error) throw new Error(error.message);
};

export const completeProfile = (userId, role) => {
    return api.patch("/auth/complete-profile", { userId, role });
};