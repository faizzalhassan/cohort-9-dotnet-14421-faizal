import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import LogoutButton from "../components/Auth/LogoutButton";

const Dashboard = () => {
    return (
        <div style={{ padding: "40px" }}>
            <h1>Dashboard</h1>
            <p>Login Successful 🎉</p>

            <LogoutButton />
        </div>
    );
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;