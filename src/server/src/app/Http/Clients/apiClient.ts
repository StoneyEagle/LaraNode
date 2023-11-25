import Auth from '@/app/Utils/Auth';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AxiosInstance {
	request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	delete<T = any, S = any>(url: string, data?: S, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	post<T = any, S = any>(url: string, data?: S, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	put<T = any, S = any>(url: string, data: S, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	patch<T = any, S = any>(url: string, data: S, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

export default () => {
	return axios.create({
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${Auth.getAccessToken()}`,
		},
		baseURL: `https://api-dev.nomercy.tv/v1/`,
	}) as AxiosInstance;
};
