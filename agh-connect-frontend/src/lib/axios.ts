import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({
						resolve: (token: string) => {
							originalRequest.headers.Authorization = 'Bearer ' + token;
							resolve(api(originalRequest));
						},
						reject: (err: any) => {
							reject(err);
						},
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem('refreshToken');

				if (!refreshToken) {
					throw new Error('Brak refresh tokena');
				}

				const response = await axios.post(`${process.env.BASE_URL}/auth/refresh`, {
					refreshToken: refreshToken,
				});

				const { accessToken, refreshToken: newRefreshToken } = response.data;

				localStorage.setItem('token', accessToken);
				if (newRefreshToken) {
					localStorage.setItem('refreshToken', newRefreshToken);
				}

				api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

				processQueue(null, accessToken);

				originalRequest.headers.Authorization = 'Bearer ' + accessToken;
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);

				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');

				if (typeof window !== 'undefined') {
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
