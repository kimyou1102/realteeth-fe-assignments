import type { AxiosRequestConfig } from "axios";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
});

async function get<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.get<T>(config.url!, config);
  return response.data;
}

async function post<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.post<T>(
    config.url!,
    config.data,
    config,
  );
  return response.data;
}

async function patch<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.patch<T>(
    config.url!,
    config.data,
    config,
  );
  return response.data;
}

async function put<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.put<T>(config.url!, config.data, config);
  return response.data;
}

async function del<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.delete<T>(config.url!, config);
  return response.data;
}

const client = {
  get,
  post,
  patch,
  put,
  delete: del,
};

export default client;
