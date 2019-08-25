import init from 'jooks'
import nock from 'nock'
import { useWordPress } from '../dist/bundle'

const testDomain = 'http://localhost'

describe('useWordPress', () => {
  afterAll(() => {
    nock.restore()
  })
  it('should be a function', () => {
    expect(typeof useWordPress).toEqual('function')
  })
  describe('fetchData()', () => {
    const jooks = init(() => useWordPress(1234, testDomain))
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
      const { error, fetchData } = jooks.run()
      expect(error).toBeUndefined()
      expect(typeof fetchData).toEqual('function')
      await fetchData('/succeed', mock)
      expect(error).toBeUndefined()
      expect(mock).toHaveBeenCalledWith({ id: 1 })
    })
    it('should handle unsuccessful responses', async () => {
      await jooks.mount()
      const { fetchData } = jooks.run()
      expect(jooks.run().error).toBeUndefined()
      expect(typeof fetchData).toEqual('function')
      await fetchData(`/fail`, mock)
      expect(mock).not.toHaveBeenCalled()
      expect(jooks.run().error).not.toBeUndefined()
    })
  })
  describe('get()', () => {
    const jooks = init(() => useWordPress(1234, testDomain))
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
    it('should handle all configurations', async () => {
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
    const jooks = init(() => useWordPress(1234, testDomain))
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
    it('should handle all configurations', async () => {
      await jooks.mount()
      const { error, getById } = jooks.run()
      expect(error).toBeUndefined()
      expect(typeof getById).toEqual('function')
      await getById()
      expect(jooks.run().data).toBeUndefined()
      expect(jooks.run().error).toBeUndefined()
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
    const jooks = init(() => useWordPress(1234, testDomain))
    const recordWithEmbed = {
      _embedded: {
        'wp:featuredmedia': [{
          id: 10
        }]
      },
      id: 3
    }
    nock(testDomain)
      .get('/posts&slug=test')
      .reply(200, { id: 2 })
      .get('/pages&context=embed&offset=10&slug=test-page&_embed')
      .reply(200, recordWithEmbed)
    afterEach(() => {
      jest.resetAllMocks()
    })
    it('should handle all configurations', async () => {
      await jooks.mount()
      const { getBySlug } = jooks.run()
      await getBySlug()
      expect(jooks.run().data).toBeUndefined()
      expect(jooks.run().error).toBeUndefined()
      await getBySlug('test')
      expect(jooks.run().data).toEqual({ id: 2 })
      expect(jooks.run().featuredMedia).toEqual([])
      await getBySlug('test-page', 'pages', { context: 'embed', offset: 10 }, true)
      await jooks.mount()
      expect(jooks.run().data).toEqual(recordWithEmbed)
      expect(jooks.run().featuredMedia.length).toEqual(1)
      expect(jooks.run().loading).toEqual(false)
    })
  })
  describe('getPageById', () => {
    const jooks = init(() => useWordPress(1234, testDomain))
    nock(testDomain)
      .get('/pages/11&_embed')
      .reply(200, { id: 11 })
      .get('/pages/12')
      .reply(200, { id: 12 })
    it('should handle all configurations', async () => {
      await jooks.mount()
      expect(jooks.run().data).toBeUndefined()
      expect(jooks.run().error).toBeUndefined()
      const { getPageById } = jooks.run()
      await getPageById(11)
      await jooks.mount()
      expect(jooks.run().data).toEqual({ id: 11 })
      await getPageById(12, {}, false)
      expect(jooks.run().data).toEqual({ id: 12 })
    })
  })
  describe('getPageBySlug', () => {
    const jooks = init(() => useWordPress(1234, testDomain))
    nock(testDomain)
      .get('/pages&slug=test1&_embed')
      .reply(200, { id: 13 })
      .get('/pages&slug=test2')
      .reply(200, { id: 14 })
    it('should handle all configurations', async () => {
      await jooks.mount()
      expect(jooks.run().data).toBeUndefined()
      expect(jooks.run().error).toBeUndefined()
      const { getPageBySlug } = jooks.run()
      await getPageBySlug('test1')
      await jooks.mount()
      expect(jooks.run().data).toEqual({ id: 13 })
      await getPageBySlug('test2', {}, false)
      expect(jooks.run().data).toEqual({ id: 14 })
    })
  })
})
