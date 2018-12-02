const uuid = require('uuid/v4')

module.exports = (state) =>  ({
  name: state.name || 'anon',
  level: state.level || 1,
  selectionStatus: 0, // 0 => pending, 1 => taken action
  inventory: {
    [uuid()]: { type: 'potion', id: 'potion-1' },
    [uuid()]: { type: 'potion', id: 'potion-1' },
  },
  inventorySpace: 5,
  addToInventory({ type, id }) {
    if (this.inventoryIsFull) {
      return false
    }
    this[uuid()] = { type, id }
    if (Object.keys(this.inventory).length == this.inventorySpace) {
      this.inventoryIsFull = true
    }
    return true
  },
  inventoryIsFull: false
})