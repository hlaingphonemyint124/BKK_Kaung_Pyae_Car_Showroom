import api from "./api";

export const getPublicTeam = () => api.get("/users/team");
