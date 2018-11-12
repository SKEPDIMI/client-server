var helpers = {}

// not all entities will be places in the same postion
// therefore we need to set their positions based on how many other entities of their type there are
helpers.coordinatesForEntity = ({entityData}, store) => {
  const w = window.innerWidth
  const h = window.innerHeight

  if (entityData.enemy) {
    let enemies = Object.values(store.gameReducer.enemies).length;

    return {
      x: w*(3/4),
      y: h*(4/7),
    }
  } else {
    let players = Object.values(store.gameReducer.players).length;

    return {
      x: w*(1/4),
      y: h*(4/7)
    }
  }
}

export default helpers
