export default (gameInstance) => {
  gameInstance.load.setBaseURL('http://localhost:5000')
  
  gameInstance.load.image('bg', 'public/assets/img/bg-forest.png');
  gameInstance.load.spritesheet('dwarf', 'public/assets/img/characters/dwarf.png', { frameWidth: 32, frameHeight: 40 });
  gameInstance.load.spritesheet('bat', 'public/assets/img/enemies/bat.png', { frameWidth: 32, frameHeight: 32 });
}