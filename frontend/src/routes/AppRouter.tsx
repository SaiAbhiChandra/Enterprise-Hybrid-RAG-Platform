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
import ChatPage from "../pages/Chat/ChatPage";
import SettingsPage from "../pages/Settings/SettingsPage";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

type LayoutProps = {
    children: React.ReactNode;
};

function ProtectedLayout({
    children,
}: LayoutProps) {

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

                {/* Public */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Protected */}

                <Route
                    path="/"
                    element={
                        <ProtectedLayout>

                            <Dashboard />

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