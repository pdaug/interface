import axios from "axios";

// apis
import Instance from "./Instance";
import Login from "./Login";
import Session from "./Session";
import Settings from "./Settings";
import User from "./User";

export const apiBase = axios.create({
  baseURL: "https://api.forzasistemas.com",
  timeout: 10000,
});

export default {
  Instance,
  Login,
  Session,
  User,
  Settings,
};
