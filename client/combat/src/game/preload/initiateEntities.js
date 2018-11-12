import DwarfInitializer from '../entities/Dwarf'
import BatInitializer from '../entities/Bat'

export default (gameInstance) => {
  gameInstance.entities = {
    0: DwarfInitializer(gameInstance),
    1: BatInitializer(gameInstance),
  }
}
