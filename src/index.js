import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { useState } from 'react'

export const useWordPress = (baseUri = '/?rest_route=/wp/v2/') => {
  const [error] = useState()
  const [entities, setEntities] = useState()

  const fetchEntities = async () => {}
  const fetchEntity = async () => {}
  const fetchPage = async () => {}
  const fetchPages = async () => {}
  const fetchPost = async () => {}
  const fetchPosts = async () => {}
  const fetchMedia = async () => {}
  const fetchSearch = async () => {}
  const fetchSettings = async () => {}

  return {
    error,
    fetchEntities,
    fetchEntity
  }
}
