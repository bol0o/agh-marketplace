import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { RefreshResponse } from '@/types/auth';

interface FailedRequest {
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (typeof window !== 'undefined') {
		const token = Cookies.get('accessToken');

		if (token && !config.url?.includes('/auth/refresh')) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			if (token) prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		const status = error.response?.status;
		if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {
			if (
				originalRequest.url?.includes('/auth/login') ||
				originalRequest.url?.includes('/auth/refresh')
			) {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({
						resolve: (token: string) => {
							originalRequest.headers.Authorization = `Bearer ${token}`;
							resolve(api(originalRequest));
						},
						reject: (err: unknown) => reject(err),
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = Cookies.get('refreshToken');
				if (!refreshToken) throw new Error('No refresh token');

				const { data } = await axios.post<RefreshResponse>(`${BASE_URL}/auth/refresh`, {
					token: refreshToken,
				});

				const newAccessToken = data.accessToken;
				const isProduction = process.env.NODE_ENV === 'production';

				Cookies.set('accessToken', newAccessToken, {
					secure: isProduction,
					sameSite: 'strict',
				});

				api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				return api(originalRequest);
			} catch (refreshError: unknown) {
				processQueue(refreshError, null);

				Cookies.remove('accessToken');
				Cookies.remove('refreshToken');

				if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
					window.location.href = '/login';
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);
export default api;
