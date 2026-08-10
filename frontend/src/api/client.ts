import axios from "axios";

// Falls back to localhost for local dev; set VITE_API_BASE_URL in
// .env.production (or your host's env config) when deploying so the
// built app points at your real backend instead of localhost.
const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    return config;

});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export { baseURL };
export default api;
