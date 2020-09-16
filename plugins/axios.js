import Cookies from 'jscookie'
import client from '~/api/client'

export default function ({ $axios, store }) {
  $axios.defaults.withCredentials = true
  if (process.client) {
    $axios.interceptors.request.use((config) => {
      // Set CSRF token in request headers
      config.headers.common['X-CSRFToken'] = Cookies.get('csrftoken')
      return config
    })
  }
  if (process.server) {
    $axios.interceptors.request.use((config) => {
      // Set session cookie to request backend API sever-side
      if (store.getters['user/getSessionCookie']) {
        config.headers.common.cookie = store.getters['user/getSessionCookie']
      }
      return config
    })
  }
  client.axios = $axios
}
