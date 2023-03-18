import {moveCreepTo} from "../nav/pathfinder";

export const run = (creep: Creep) => {
  if(creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: resource => resource.resourceType === RESOURCE_ENERGY
    });
    if (source) {
      if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
        moveCreepTo(creep, source.pos);
      }
      return true
    } else {
      const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES);
      if (tombstone) {
        if(creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          moveCreepTo(creep, tombstone.pos);
        }
        return true;
      }
    }
  }

  return false;
}
