/**
 *
 * @param {Room} room
 * @returns {Array<Structure>}
 */
export const findThingsToRepair = (room: Room) => {
  const MIN_WALL_HEALTH = 5000;
  return room.find(FIND_STRUCTURES, {
    filter: object => {
      return (
        (object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax / 3) ||
        (object.structureType == STRUCTURE_CONTAINER && object.hits < object.hitsMax / 3) ||
        (object.structureType == STRUCTURE_WALL && object.hits < MIN_WALL_HEALTH) ||
        (object.structureType == STRUCTURE_RAMPART && object.hits < MIN_WALL_HEALTH)
      );
    }
  });
};

/**
 *
 * @param {Room} room
 * @returns {Array<Structure>}
 */
export const findThingsToBuild = (room: Room) => {
  return room.find(FIND_CONSTRUCTION_SITES);
};

/**
 *
 * @param {Creep} creep
 * @returns {Array<Structure>}
 */
export const findEnergyStorageLocations = (creep: Creep) => {
  const storageLocations = creep.room
    .find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_CONTAINER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      }
    })
    .sort((a, b) => {
      if (a.structureType === STRUCTURE_CONTAINER && b.structureType !== STRUCTURE_CONTAINER) {
        return 1;
      }

      if (b.structureType === STRUCTURE_CONTAINER && a.structureType !== STRUCTURE_CONTAINER) {
        return -1;
      }

      return 0;
    });

  return storageLocations;
};

export const findClosestEnergyStorage = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    }
  });
};
