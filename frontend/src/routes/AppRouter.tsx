import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DocumentsPage from "../pages/Documents/DocumentsPage";
import ChatPage from "../pages/Chat/ChatPage";
import SettingsPage from "../pages/Settings/SettingsPage";

import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected app shell -- sidebar persists, only the
                    Outlet content below changes between routes. */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppShell />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/"
                        element={<Navigate to="/chat" replace />}
                    />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route
                        path="/chat/:conversationId"
                        element={<ChatPage />}
                    />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/chat" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
