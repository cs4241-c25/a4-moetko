import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import CompletedPage from "./pages/CompletedPage";
import Navbar from "./components/Navbar";

const App = () => {

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/completed" element={<CompletedPage />} />
                {/* 404 Catch-All */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
};

export default App;
