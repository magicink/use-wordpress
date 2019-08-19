[![Build Status](https://travis-ci.org/magicink/use-wordpress.svg?branch=develop)](https://travis-ci.org/magicink/use-wordpress)

# Overview

Useful React Hooks for WordPress.

### Requirements

This library relies upon an implementation of WHATWG `fetch` and `URLSearchParams`.

## Initialization

### `useWordPress(baseUri: string)`

#### Usage

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

#### Arguments

| name | type | required | default | description |
|---|---|---|---|---|
| `baseUri` | `string` | no | `?/rest_route=/wp/v2` | The base URI of WordPress's REST API. |

## API

### Properties

| name | type | description |
|---|---|---|
| `data` | `any` | The response from the fetch call. |
| `embedded` | `Object` | Stores the `_embedded` property of an entity if it exists. |
| `featuredMedia` | `Array<Object>` | Stores the `wp:featuredmedia` array of `embedded` if it exists. |
| `error` | `Error` | Any errors returned from the fetch calls. |
| `loading` | `boolean` | Whether or not a fetch is currently being performed. |
| `total` | `Number` |  The total number of records in the collection. |
| `totalPages` | `Number` | the total number of pages encompassing all available records. |

### Methods

#### `fetchData (endpoint: string, callback: Function, options: Object)`

A wrapper for `window.fetch()`. Populates `total` and `totalPages` with the values of `x-wp-total` and
`x-wp-totalpages`, respectively, if they are present in the response header.

| name | type | required | default | description |
|---|---|---|---|---|
| `endpoint` | `string` | yes | | The portion of the URI that is appended on the base URI passed into the initializer. |
| `callback` | `Function` | yes | | A callback that invoked upon a successful fetch request. |
| `options` | `Object` | no | | Options passed to the fetch call. |

#### `get (type: string, options: {[key: string]: string}, getEmbedded: boolean)`

Used to fetch a collection of `type`.

| name | type | required | default | description |
|---|---|---|---|---|
| `type` | `string` | no | `posts` | The type of record your are fetch (i.e `posts`, `pages`, `categories`). |
| `options` | `Object` | no | `{}`| An object that is converted into search parameters. |
| `getEmbedded` | `boolean` | no | `false` | If `true` it will add the `_embed` search parameter to the fetch. |

#### `getById (id: number, type: string, options: {[key: string]: string, getEmbedded: boolean)`

Used to fetch a record by its ID.

| name | type | required | default | description |
|---|---|---|---|---|
| `id` | `number` | yes | | The ID of the record your are trying to fetch. |
| `type` | `string` | yes | `posts` | The type of record your are fetch (i.e `posts`, `pages`, `categories`). |
| `options` | `Object` | no | `{}`| An object that is converted into search parameters. |
| `getEmbedded` | `boolean` | no | `false` | If `true` it will add the `_embed` search parameter to the fetch. |

#### `getBySlug (slug: string, type: string, options: {[key: string]: string, getEmbedded: boolean)`

Used to fetch a record by its slug.

| name | type | required | default | description |
|---|---|---|---|---|
| `slug` | `string` | yes | | The slug of the record your are trying to fetch. |
| `type` | `string` | yes | `posts` | The type of record your are fetch (i.e `posts`, `pages`, `categories`). |
| `options` | `Object` | no | `{}`| An object that is converted into search parameters. |
| `getEmbedded` | `boolean` | no | `false` | If `true` it will add the `_embed` search parameter to the fetch. |

#### `getEmbedded (entity: {'_embedded': Object})`

Stores the `_embedded` of `entity` if it exists. The value of `_embedded` is assigned to `embedded` (see "Properties").

| name | type | required | default | description |
|---|---|---|---|---|
| `entity` | `{'_embedded': Object}` | yes | | The data source. |

#### `getFeaturedMedia (embedded: {'wp:featuredmedia': Array<Object>})`

Stores the `wp:featuredmedia` of `embedded` if it exists. The value of `wp:featuredmedia` is stored in `featuredMedia` (see "Properties").

| name | type | required | default | description |
|---|---|---|---|---|
| `embedded` | `{'wp:featuredmedia': Array<Object>}` | yes | | The data source. |