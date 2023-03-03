import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal, ResponseType } from 'axios'
import request from './axios'
export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
  responseType?: ResponseType
}

export interface Response<T = any> {
  data: T
  message: string | null
  status: string
}

function http<T = any>(
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest, responseType }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data.status === 'Success' || typeof res.data === 'string')
      return res.data

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  if (method === 'GET')
    return request.get(url, { params, signal, onDownloadProgress, responseType }).then(successHandler, failHandler)

  // return method === 'GET'
  //   ?
  //   : request.post(url, params, { headers, signal, onDownloadProgress, responseType }).then(successHandler, failHandler)
  if (method === 'POST') {
    fetch(import.meta.env.VITE_GLOB_API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...headers,
      },
      body: JSON.stringify({
        max_tokens: 100,
        temperature: 0.5,
        n: 1,
        stream: true,
        ...data,
      }),
    }).then((response) => {
      const reader = response.body?.getReader()
      function readStream() {
        if (reader) {
          reader.read().then(
            ({ value, done }) => {
              if (!done) {
                const data = new TextDecoder().decode(value)

                // console.log(data)
                onDownloadProgress?.({
                  event: { target: { responseText: data } },
                  loaded: 0,
                  bytes: 0,
                })
                return readStream()
              }
              else {
              // eslint-disable-next-line no-console
                console.trace('done')
              }
            },

          ).catch((error) => {
            return Promise.reject(error)
          })
        }
      }
      return readStream()
    }).catch((error) => {
      return Promise.reject(error)
    })
  }
  return Promise.resolve({ data: '' } as Response<T>)
}

export function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest, responseType }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
    responseType,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest, responseType }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
    responseType,
  })
}

export default post
