var helpers = {}

helpers.coordinatesForEntityNumber = (n) => {
  // all user's will not be in the same position.
  // therefore we need to set their position based on how many users there are (n)

  // this is the default position:
  return {
    x: window.innerWidth/4,
    y: window.innerHeight*(4/7)
  }
}

export default helpers
