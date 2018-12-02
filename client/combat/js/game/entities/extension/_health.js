function extensionHealth (state) {
  return {
    healthBar: null,
    healthBarBackground: null,
    setHealth: function(health) {
      var currentHealth = this.entity.health;
  
      if(health == currentHealth) return this
  
      if (typeof health == 'number') {
        this.entity.health = health
      }
  
      return this
    },
    updateHealthBar: function() {
      var nameTag = this.nameTag;
  
      if (this.healthBar) {
        this.healthBar.destroy();
      }
      if (this.healthBarBackground) {
        this.healthBarBackground.destroy();
      }
  
      var graphics = playScreen.instance.add.graphics(nameTag.x, nameTag.y);
      var healthWidth = (this.entity.health/this.entity.maxHealth) * nameTag.width;
  
      this.healthBar = graphics
        .fillStyle(0x56F33E)
        .fillRect(nameTag.x, nameTag.y + nameTag.height, healthWidth, 6);
  
      this.healthBarBackground = graphics
        .fillStyle(0xBEBEBE)
        .fillRect(
          nameTag.x + healthWidth,
          nameTag.y + nameTag.height,
          nameTag.width - healthWidth,
          5
        );
  
      return this
    }
  }
}