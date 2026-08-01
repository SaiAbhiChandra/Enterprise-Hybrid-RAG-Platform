import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

import Dashboard from "../pages/Dashboard/Dashboard";
import UploadPage from "../pages/Upload/UploadPage";
import DocumentsPage from "../pages/Documents/DocumentsPage";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import ChatPage from "../pages/Chat/ChatPage";
import SettingsPage from "../pages/Settings/SettingsPage";

function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <MainLayout>
                {children}
            </MainLayout>
        </ProtectedRoute>
    );
}

export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Protected Routes */}

                <Route
                    path="/"
                    element={
                        <ProtectedLayout>
                            <Dashboard />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/upload"
                    element={
                        <ProtectedLayout>
                            <UploadPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/documents"
                    element={
                        <ProtectedLayout>
                            <DocumentsPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedLayout>
                            <ChatPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedLayout>
                            <SettingsPage />
                        </ProtectedLayout>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}