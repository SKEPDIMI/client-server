import DwarfInitializer from '../entities/Dwarf'

export default (gameInstance) => {
  gameInstance.entities = {
    0: DwarfInitializer(gameInstance)
  }
}
