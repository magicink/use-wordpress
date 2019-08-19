import init from 'jooks'
import nock from 'nock'
import { useWordPress } from './index'

const testDomain = 'http://localhost'

describe('useWordPress', () => {
  afterAll(() => {
    nock.restore()
  })
  it('should be a function', () => {
    expect(typeof useWordPress).toEqual('function')
  })
  describe('fetchData()', () => {
    const jooks = init(() => useWordPress(testDomain))
    const mock = jest.fn()
    nock(testDomain)
      .get('/succeed')
      .reply(200, { id: 1 })
      .get('/fail')
      .reply(500, { error: true })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should handle successful responses', async () => {
      await jooks.mount()
      let { error, fetchData } = jooks.run()
      expect(error).toBeUndefined()
      expect(typeof fetchData).toEqual('function')
      await fetchData('/succeed', mock)
      expect(error).toBeUndefined()
      expect(mock).toHaveBeenCalledWith({ id: 1 })
    })
    it('should handle unsuccessful responses', async () => {
      await jooks.mount()
      let { fetchData } = jooks.run()
      expect(jooks.run().error).toBeUndefined()
      expect(typeof fetchData).toEqual('function')
      await fetchData(`/fail`, mock)
      expect(mock).not.toHaveBeenCalled()
      expect(jooks.run().error).not.toBeUndefined()
    })
  })
  describe('get()', () => {
    const jooks = init(() => useWordPress(testDomain))
    nock(testDomain)
      .get('/posts')
      .reply(200, [{ id: 2 }], {
        'x-wp-total': 1,
        'x-wp-totalpages': 1
      })
      .get('/pages&context=view&offset=10&_embed')
      .reply(200, [
        { id: 3 },
        { id: 4 }
      ], {
        'x-wp-total': 2,
        'x-wp-totalpages': 1
      })
    it('should handle various configurations', async () => {
      await jooks.mount()
      const { get } = jooks.run()
      expect(jooks.run().total).toEqual(0)
      expect(jooks.run().totalPages).toEqual(0)
      await get()
      expect(jooks.run().data).toEqual([{ id: 2 }])
      expect(jooks.run().total).toEqual(1)
      await get('pages', { context: 'view', offset: 10 }, true)
      expect(jooks.run().data).toHaveLength(2)
      expect(jooks.run().total).toEqual(2)
      expect(jooks.run().totalPages).toEqual(1)
      expect(jooks.run().loading).toEqual(false)
    })
  })
  describe('getById()', () => {
    const jooks = init(() => useWordPress(testDomain))
    nock(testDomain)
      .get('/posts/2')
      .reply(200, { id: 2 })
      .get('/pages/3')
      .reply(200, { id: 3 })
      .get('/posts/4&_embed')
      .reply(200, { id: 4 })
      .get('/posts/5&context=embed')
      .reply(200, { id: 5 })
      .get('/posts/6&context=embed&_embed')
      .reply(200, { id: 6 })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should handle various configurations', async () => {
      await jooks.mount()
      const { error, getById } = jooks.run()
      expect(error).toBeUndefined()
      expect(typeof getById).toEqual('function')
      await getById(2)
      expect(jooks.run().data).toEqual({ id: 2 })
      await getById(3, 'pages')
      expect(jooks.run().data).toEqual({ id: 3 })
      await getById(4, 'posts', {}, true)
      expect(jooks.run().data).toEqual({ id: 4 })
      await getById(5, 'posts', { context: 'embed' })
      expect(jooks.run().data).toEqual({ id: 5 })
      await getById(6, 'posts', { context: 'embed' }, true)
      expect(jooks.run().data).toEqual({ id: 6 })
      expect(jooks.run().loading).toEqual(false)
    })
  })
  describe('getBySlug()', () => {
    const jooks = init(() => useWordPress(testDomain))
    nock(testDomain)
      .get('/posts&slug=test')
      .reply(200, { id: 2 })
      .get('/pages&context=embed&offset=10&slug=test-page&_embed')
      .reply(200, { id: 3 })
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should handle various configurations', async () => {
      await jooks.mount()
      const { getBySlug } = jooks.run()
      await getBySlug('test')
      expect(jooks.run().data).toEqual({ id: 2 })
      await getBySlug('test-page', 'pages', { context: 'embed', offset: 10 }, true)
      expect(jooks.run().data).toEqual({ id: 3 })
      expect(jooks.run().loading).toEqual(false)
    })
  })
})
