var bootScreen = {
  key: 'bootScreen',
  init: function() {
    bootScreen.instance = this;
  },
  create: function() {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    this.add.text(
      width/2, height/2,
      'Please enter your name',
      { fontSize: '25px', fill: '#fff'}  
    )
    .setOrigin(0.5, 0.5);
  },
}