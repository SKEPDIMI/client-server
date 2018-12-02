function extensionAnimationKey(state) {
  return {
    getAnimationKey(key) {
      var animationKey = state.animationKey[key];
      if (!animationKey) {
        throw Error('Missing animation key ' + animationKey + ' for ' + state.id)
      }

      return animationKey
    }
  }
}