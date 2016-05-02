export function SimplManager(state) {
  return {
    state: state,
    first(resource_name) {
      return [...this.state[resource_name] || []][0]
    },
    last(resource_name) {
      return [...this.state[resource_name] || []].pop()
    }
  }
}

export default SimplManager
