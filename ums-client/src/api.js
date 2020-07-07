import axios from "axios";
import configuration from "./configuration";

const api = axios.create();

// export const importUsers = (users: any) => {
//     return api.post(configuration.backend + "/userinfo/addUsers", users);
// };
export const importUsers = configuration.backend + "/userinfo/addUsers";

export default api;
