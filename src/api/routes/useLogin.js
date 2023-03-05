import {useAuth} from "../../auth/useAuth";
import useClient from "../useClient";

const useLogin = () => {
  const auth = useAuth();
  const client = useClient();
  const login = (username, password) => {
    return client.fetch('api/token/', {
      body: {
        username: username,
        password: password
      }
    }).then(res => {
      auth.login(res.access, res.refresh)
    });
  }

  return {login};
}

export default useLogin;