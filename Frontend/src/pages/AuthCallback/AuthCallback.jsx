import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import api from "../../api/axios";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase puts the session in the URL hash after OAuth redirect
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    setError("Authentication failed. Please try again.");
                    return;
                }

                // Exchange Supabase access token for our own JWT
                const res = await api.post("/auth/google/callback", {
                    access_token: session.access_token,
                });

                const { user, token, isNewUser } = res.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                if (isNewUser) {
                    navigate("/complete-profile");
                    return;
                }

                // Existing user — redirect based on role
                const role = user.role?.toUpperCase();
                if (role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if (role === "INSTRUCTOR") {
                    navigate("/instructor/dashboard");
                } else {
                    navigate("/dashboard");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Authentication failed. Please try again.");
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #f0f4ff 0%, #fafafa 60%, #f0fdfa 100%)",
            gap: "1rem",
        }}>
            {error ? (
                <>
                    <div style={{
                        background: "#fef2f2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "1rem 1.5rem",
                        fontSize: "0.95rem",
                    }}>
                        {error}
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Back to Login
                    </button>
                </>
            ) : (
                <>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(79, 70, 229, 0.2)",
                        borderTop: "3px solid #4f46e5",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }} />
                    <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                        Completing sign in...
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
            )}
        </div>
    );
}
