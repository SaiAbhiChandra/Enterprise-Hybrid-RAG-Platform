import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/useAuth";

export default function Sidebar() {
    const navigate = useNavigate();

    const { logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const menuItem =
        "block w-full rounded-lg px-4 py-3 transition";

    const active =
        "bg-indigo-600 text-white";

    const inactive =
        "text-slate-300 hover:bg-slate-800";

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

            <div className="p-6 border-b border-slate-800">

                <h1 className="text-2xl font-bold">

                    Enterprise RAG

                </h1>

                <p className="text-sm text-slate-400 mt-2">

                    AI Knowledge Platform

                </p>

            </div>

            <nav className="flex-1 p-4 space-y-2">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${menuItem} ${isActive ? active : inactive}`
                    }
                >
                    🏠 Dashboard
                </NavLink>

                <NavLink
                    to="/upload"
                    className={({ isActive }) =>
                        `${menuItem} ${isActive ? active : inactive}`
                    }
                >
                    📤 Upload
                </NavLink>

                <NavLink
                    to="/documents"
                    className={({ isActive }) =>
                        `${menuItem} ${isActive ? active : inactive}`
                    }
                >
                    📄 Documents
                </NavLink>

                <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                        `${menuItem} ${isActive ? active : inactive}`
                    }
                >
                    💬 Chat
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `${menuItem} ${isActive ? active : inactive}`
                    }
                >
                    ⚙️ Settings
                </NavLink>

            </nav>

            <div className="border-t border-slate-800 p-4">

                <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
                >
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}