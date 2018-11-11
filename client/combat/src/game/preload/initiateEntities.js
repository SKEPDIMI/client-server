import DwarfInitializer from '../entities/Dwarf'

export default (gameInstance) => {
  gameInstance.entities = {
    'dwarf': DwarfInitializer(gameInstance)
  }
}
