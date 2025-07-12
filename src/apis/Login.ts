// apis
import { ApiBase } from ".";

// types
import { ApiResponse } from "../types/Api";

const Login = function <T>(
  instance: string,
  data: { login: string; password: string },
) {
  const headers = { "X-Instance": instance };
  const config = { headers };
  return ApiBase.post<ApiResponse<T>>("/login", data, config);
};

export default Login;
