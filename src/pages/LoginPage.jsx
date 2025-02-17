import React from "react";

const LoginPage = () => {
    const handleLogin = () => {
        // redirect to GitHub OAuth
        window.location.href = "https://a4-moetko.vercel.app/auth/github";
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login Page</h1>
            <p>Please log in to access your tasks.</p>
            <button
                onClick={handleLogin}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Login with GitHub
            </button>
        </div>
    );
};

export default LoginPage;
