import HttpException from "./httpException";
import {useAuth} from "../auth/useAuth";

const useClient = () => {
  const auth = useAuth();
  const fetch = (endpoint, {body, ...params}) => {
    const apiUrl = process.env.REACT_APP_SERVER_API_URL || 'http://localhost';
    const headers = {
      'Content-Type': 'application/json',
    }

    if (auth.isAuth) {
      if (!auth.getAccessToken()) {
        auth.logout();
        throw new Error('Token is invalid');
      }
      Object.assign(headers, {'Authorization': 'Bearer ' + auth.getAccessToken()})
    }

    const config = {
      method: body ? 'POST' : 'GET',
      ...params,
      headers: {
        ...headers,
        ...params.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    return window
      .fetch(`${apiUrl}/${endpoint}`, config)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(err => {
            if (res.status === 401) {
              if (endpoint !== 'api/token/' && endpoint !== 'api/token/refresh/') {
                return updateTokens(endpoint, {body, ...params});
              }
              auth.logout();
            }
            throw new HttpException(err.detail || 'unknown', res.status);
          })
        }
      });
  };

  const updateTokens = (endpoint, {body, ...params}) => {
    return fetch('api/token/refresh/', {
      body: {'refresh': auth.getRefreshToken()}
    }).then(res => {
      auth.login(res.access, auth.getRefreshToken());
      return fetch(endpoint, {body, params});
    })
  };

  return {fetch};
};

export default useClient;