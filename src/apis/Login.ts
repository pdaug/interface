// apis
import { apiBase } from ".";

// types
import { ApiResponse } from "../types/apis";

const Login = function <T>(
  instance: string,
  data: { login: string; password: string },
) {
  const headers = { "X-Instance": instance };
  const config = { headers };
  return apiBase.post<ApiResponse<T>>("/login", data, config);
};

export default Login;
