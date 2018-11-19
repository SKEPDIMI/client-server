var helpers = {}

// not all entities will be places in the same postion
// therefore we need to set their positions based on how many other entities of their type there are
helpers.coordinatesForEntity = ({entityData}, emptySpotIndex) => {
  if (typeof entityData != 'object') {
    throw new Error('ENTITY_DATA MUST BE AN OBJECT')
  }
  if (typeof emptySpotIndex != 'number') {
    throw new Error('EMPTY_SPOT_INDEX MUST BE A NUMBER')
  }
  
  const w = window.innerWidth
  const h = window.innerHeight

  if (entityData.enemy) {
    switch(emptySpotIndex) {
      case 0:
        return {
          x: w*(10/12),
          y: h*(5/12)
        }
      case 1:
        return {
          x: w*(9/12),
          y: h*(6/12)
        }
      case 2:
        return {
          x: w*(8/12),
          y: h*(7/12)
        }
      case 3:
        return {
          x: w*(9/12),
          y: h*(8/12)
        }
        
    }
    return 
  } else {
    switch(emptySpotIndex) {
      case 0:
        return {
          x: w*(2/12),
          y: h*(11/20)
        }
      case 1:
        return {
          x: w*(3/12),
          y: h*(10/20)
        }
      case 2:
        return {
          x: w*(4/12),
          y: h*(9/20)
        }
      case 3:
        return {
          x: w*(5/12),
          y: h*(8/20)
        }
    }
  }
}

helpers.findEmptySpotInLine = function(placingLine) {
  if (typeof placingLine != 'object') throw new Error('PLACING LINE IS NOT AN OBJECT')

  for (i in placingLine) {
    if (!placingLine[i]) {
      return Number(i)
    }
  }

  return null
}
