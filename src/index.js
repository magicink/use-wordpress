import { useState } from 'react'

export const useWordPress = (baseUri = '/?rest_route=/wp/v2') => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = async (endpoint, callback, options) => {
    setLoading(true)
    const uri = `${baseUri}${endpoint}`
    try {
      const response = await fetch(uri, options)
      if (!response.ok) {
        throw new Error()
      }
      const json = await response.json()
      setTotal(parseInt(response.headers.get('X-WP-Total')))
      setTotalPages(parseInt(response.headers.get('X-WP-TotalPages')))
      callback && callback(json)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const embedParam = '&_embed'

  const get = async (type = 'posts', options = {}, getEmbedded = false) => {
    const params = optionsToSearchParams(options)
    const endpoint = `/${type}${params ? `&${params}` : ''}${getEmbedded ? embedParam : ''}`

    await fetchData(endpoint, data => {
      setData(data)
    })
  }

  const getById = async (id, type = 'posts', options = {}, getEmbedded = false) => {
    const params = optionsToSearchParams(options)
    const endpoint = `/${type}/${id}${params ? `&${params}` : ''}${getEmbedded ? embedParam : ''}`

    await fetchData(endpoint, data => {
      setData(data)
    })
  }

  const getBySlug = async (slug, type = 'posts', options = {}, getEmbedded = false) => {
    const embedParam = '&_embed'
    const params = optionsToSearchParams({...options, slug})
    const endpoint = `/${type}&${params}${getEmbedded ? embedParam : ''}`

    await fetchData(endpoint, data => {
      setData(data)
    })
  }

  const optionsToSearchParams = (options) => {
    const params = new URLSearchParams
    if (options) {
      for (let key in options) {
        if (options.hasOwnProperty(key) && key !== '_embed') params.append(key, options[key])
      }
    }
    return params.toString()
  }

  return {
    data,
    error,
    fetchData,
    get,
    getById,
    getBySlug,
    loading,
    total,
    totalPages
  }
}
