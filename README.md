[![Build Status](https://travis-ci.org/magicink/use-wordpress.svg?branch=develop)](https://travis-ci.org/magicink/use-wordpress)

# Overview

Useful React Hooks for WordPress.

### Usage

```js
import React from 'react'
import { useWordPress } from 'use-wordpress'
export const TestComponent = props => {
  const { data, get, total, totalPages } = useWordPress()
  const [initialized, setInitialized] = React.useState(false)
  React.useEffect(() => {
    if (!initialized) {
      get('categories') // Fetches categories and assigns them to data
      setInitialized(true) 
    }
  }, [])
  return (
    // ...
  )
}
```