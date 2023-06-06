import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://phplaravel-980736-3436689.cloudwaysapps.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleErrors = (error, endpoint) => {
  console.error(`Error with request to ${endpoint}:`, error);
  throw error;
};

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.message === "Unauthenticated." ) {
      console.log("complete")
      const event = new CustomEvent('unauthorized');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

const get = async (endpoint, authToken) => {
  try {
    const response = await instance.get(endpoint, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    });
    return response.data;
  } catch (error) {
    handleErrors(error, endpoint);
  }
};

const post = async (endpoint, data, authToken) => {
    try {
      const response = await instance.post(endpoint, data, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      handleErrors(error, endpoint);
    }
  };

const put = async (endpoint, data, authToken) => {
  try {
    const response = await instance.put(endpoint, data, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error, endpoint);
  }
};

const deleteRequest = async (url, authToken) => {
  try {
    const response = await instance.delete(url, {
      headers: {
        'Referrer-Policy': 'same-origin',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error, url);
  }
};

export { instance, get, post, deleteRequest, put };
