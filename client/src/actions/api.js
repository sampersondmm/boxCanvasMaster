import axios from 'axios';
 
const setTokenHeader = (token) => {
  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

const apiCall = async (method, path, data) => {
  try {
    const response = await axios[method.toLowerCase()](path, data);
    return response.data;
  } catch (error) {
    throw error
  }
}

export {
  setTokenHeader,
  apiCall
}
