import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { store } from '../redux/store';

interface IAxiosQuery {
  url: string;
  method: AxiosRequestConfig['method'];
  data: AxiosRequestConfig['data'];
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data }: IAxiosQuery) => {
    const persistedToken = store.getState().auth.token;

    if (url === '/users/current') {
      axios.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;
    }

    try {
      const result = await axios({ url: baseUrl + url, method, data });

      if (url === '/users/logout') {
        axios.defaults.headers.common.Authorization = '';
      }
      if (url === '/users/current') {
        axios.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;
      } else {
        axios.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;
      }

      return { data: result.data };
    } catch (axiosError) {
      let error = axiosError as AxiosError;
      if (error.response?.status === 400) {
        toast.error('The name is already in use 🤷‍♂️');
      } else if (error.response?.status === 401) {
        toast.error('Please, authenticate first! ✌😎');
      } else {
        toast.error('Somethings wrong! Please try again later! 😢');
      }
      return error;
    }
  };

export default axiosBaseQuery;
