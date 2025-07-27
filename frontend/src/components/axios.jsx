import axios from 'axios'


const baseUrl = 'http://127.0.0.1:8000/'
const AxiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	}
})

AxiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('Token')

		if(token){
			config.headers.Authorization = `Token ${token}`
		}
		else {
			config.headers.Authorization = ''
		}
		return config;
	}
)

AxiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) =>{
		// if (error.response && error.response.status === 401){
		// 	localStorage.removeItem('Token')
		// }
		if (error.response) {
			console.error("Axios error response:", {
				status: error.response.status,
				data: error.response.data,
				headers: error.response.headers,
			});

			if (error.response.status === 401) {
				localStorage.removeItem('Token');
			}
		} else if (error.request) {
			console.error("No response recieved. Request was:", error.request);
		} else {
			console.error("Axios config error:", error.message);
		}

		return Promise.reject(error);
	}
)
export default AxiosInstance