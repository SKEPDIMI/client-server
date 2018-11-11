export default (gameInstance) => {
  gameInstance.load.setBaseURL('http://localhost:5000')
  
  gameInstance.load.image('bg', 'public/assets/bg-forest.png');
  gameInstance.load.spritesheet('dwarf', 'public/assets/dwarf.png', { frameWidth: 32, frameHeight: 40 });
}