function extensionIcon(state) {
  return {
    setStatusIcon: function(status) {
      var currentIcon = this.statusIcon;
      var currentStatus = this.entity.selectionStatus;
      var nameTag = this.nameTag;
      var gameInstance = playScreen.instance;

      if (currentStatus === status && currentIcon) return this

      var iconName;

      if (status == 0) {
        iconName = 'pendingIcon'
      } else if (status == 1) {
        iconName = 'okIcon'
      }

      if (!iconName) return this

      if (currentIcon) currentIcon.destroy();
      this.statusIcon = gameInstance.add.image(nameTag.x + nameTag.width, nameTag.y, iconName).setOrigin(0, 0.5);

      return this
    },
    removeStatusIcon() {
      if (this.statusIcon) {
        this.statusIcon.destroy();
        this.statusIcon = null
      }
      
      return this
    }
  }
}