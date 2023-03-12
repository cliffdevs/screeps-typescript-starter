/**
 * Return a single tower object if one exists needing energy
 * @param {Creep} creep
 */
export const locateNearestTowerNeedingFuel = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: structure  => {
      if (structure.structureType == STRUCTURE_TOWER) {
        const t = structure as StructureTower;
        return t.store[RESOURCE_ENERGY] < t.store.getCapacity(RESOURCE_ENERGY)
      }

      return false;
    }
  });
};
