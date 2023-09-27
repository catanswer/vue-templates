import qs from 'qs'
import axios from 'axios'

class Request {
	constructor(options) {
		this.config = options
		this.instance = axios.create(options)
		this.setupInterceptor()
	}

	request(config) {
		return new Promise((resolve, reject) => {
			this.instance
				.request(config)
				.then(res => {
					if (res.headers && res.headers['content-disposition']?.includes('attachment')) {
						return resolve(res)
					}
					resolve(res.result)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	get(config) {
		return this.request({ ...config, method: 'GET' })
	}
	post(config) {
		return this.request({
			...config,
			headers: {
				Accept: '*/*',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: qs.stringify(config.data, {
				arrayFormat: 'repeat',
			}),
			method: 'POST',
		})
	}
	postJson(config) {
		return this.request({
			...config,
			headers: {
				Accept: '*/*',
				'Content-Type': 'application/json;charset:utf-8',
			},
			data: config.data,
			method: 'POST',
		})
	}

	delete(config) {
		return this.request({ ...config, method: 'DELETE' })
	}

	patch(config) {
		return this.request({ ...config, method: 'PATCH' })
	}

	setupInterceptor() {
		this.instance.interceptors.request.use(
			this.interceptorHooks?.requestInterceptor,
			this.interceptorHooks?.requestInterceptorCatch,
		)
		this.instance.interceptors.response.use(
			this.interceptorHooks?.responseInterceptor,
			this.interceptorHooks?.responseInterceptorCatch,
		)

		// 请求拦截
		this.instance.interceptors.request.use(
			config => {
				return config
			},
			error => {
				return Promise.reject(error)
			},
		)
		this.instance.interceptors.response.use(
			res => {
				if (res.headers['content-disposition']?.includes('attachment')) {
					return Promise.resolve(res)
				}
				const { responseCode, message } = res.data
				if (responseCode !== '100000') {
					ElMessage.error(message)
					return Promise.reject(res.data)
				} else {
					return Promise.resolve(res.data)
				}
			},
			error => {
				if (axios.isCancel(error)) return
				ElMessage.error(`服务器异常：${error}`)
				return Promise.reject(error)
			},
		)
	}
}

const Http = new Request({
	baseURL: import.meta.env.BASE_URL,
	withCredentials: true,
	timeout: 60000,
})
export default Http
