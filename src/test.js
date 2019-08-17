import init from 'jooks'
import { useWordPress } from './index'

describe('useWordPress', () => {
  it('should be a function', () => {
    expect(typeof useWordPress).toEqual('function')
  })
  describe('fetchEntities', () => {
    const jooks = init(() => useWordPress())
    it('should have the correct default state', async () => {
      await jooks.mount()
      const { error } = jooks.run()
      expect(error).toBeUndefined()
    })
  })
})
