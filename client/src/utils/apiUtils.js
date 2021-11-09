import axios from 'axios';
 
const setTokenHeader = (token) => {
  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

const apiCall = async ({method, url, data = {}}) => {
  try {
    const response = await axios[method.toLowerCase()](url, data);
    return response.data;
  } catch (error) {
    throw error.response
  }
}

export {
  setTokenHeader,
  apiCall
}