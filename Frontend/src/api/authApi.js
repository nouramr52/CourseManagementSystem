import api from "./axios";
import { supabase } from "../config/supabase";

export const registerUser = (data) => {
    return api.post("/auth/signup", data);
};

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
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