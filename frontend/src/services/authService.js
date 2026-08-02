import api from "./api";

const authService = {
    register: async (data) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
};

export default authService;