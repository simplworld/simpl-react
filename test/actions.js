import actions from '../lib/utils/actions'

describe('Actions', () => {
  it('test stringify', () => {
    const named = actions.stringify("NAME", function() {})
    expect(named.toString()).toEqual("NAME")
  })
  it('test createNamedAction', () => {
    const named = actions.createNamedAction("NAME")
    expect(named.toString()).toEqual("NAME")
    expect(named()).toEqual({type: "NAME"})
  })
})
