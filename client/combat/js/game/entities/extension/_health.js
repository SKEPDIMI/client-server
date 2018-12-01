function extensionHealth (state) {
  var health = {

  }

  health.takeDamage = function(dmg) {
    debugger
    if (typeof dmg == 'number') {
      state.entity.health -= dmg
      if (state.entity.health < 0) {
        state.entity.health = 0
      }
      health.animateHealthChange();
    }

    return state
  }
  health.animateHealthChange = function() {
    var nameTag = state.nameTag;
    var healthBar = state.healthBar;
    var healthBarBackground = state.healthBarBackground;

    var newHealthWidth = Math.random() * nameTag.width;

    // animate these!
    healthBar.width = newHealthWidth
    healthBarBackground.width = nameTag.width - newHealthWidth
    // playScreen.instance.add.tween(healthBar)
    // .to({ width: newHealthWidth }, 500);
    // playScreen.instance.add.tween(healthBarBackground)
    // .to({ width: nameTag.width - newHealthWidth }, 500);
  }

  return health
}