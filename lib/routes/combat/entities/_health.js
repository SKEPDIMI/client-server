module.exports = (state) => ({
    health: state.health || 100,
    maxHealth: state.maxHealth || state.health || 100,
    dead: false,
    takeDamage(dmg) {
      console.log(this.entityData.name + ' took damage!');
      if (typeof dmg != 'number') {
        return this
      }
      this.health -= dmg;
      
      if (this.health < 0) {
        this.health = 0
      }

      return this
    },
    takeHealth(health) {
      if (typeof health != 'number') {
        return this.health
      }
      this.health += dmg;
      
      if (this.health > 0) {
        this.health = this.maxHealth
      }

      return this
    }
  })
