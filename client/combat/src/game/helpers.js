var helpers = {}

helpers.coordinatesForEntity = (obj, store) => {
  // not all entities will be places in the same postion
  // therefore we need to set their positions based on how many other entities of their type there are
  const w = window.innerWidth
  const h = window.innerHeight

  if (obj.enemy) {
    let enemies = Object.values(store.enemies).length;

    return {
      x: w*(3/4),
      y: h*(4/7),
    }
  } else {
    let players = Object.values(store.players).length;

    return {
      x: w*(1/4),
      y: h*(4/7)
    }
  }
}

export default helpers
