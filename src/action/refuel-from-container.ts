import * as creepNavigator from "../nav/pathfinder";

export const run = (creep: Creep) => {
  const sources = creep.room.find(FIND_STRUCTURES, {
    filter: object =>
      (object.structureType === STRUCTURE_CONTAINER || object.structureType === STRUCTURE_STORAGE) &&
      object.store[RESOURCE_ENERGY] > 0
  }).map(structure => structure as StructureStorage);

  if (sources.length > 0) {
    if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creepNavigator.moveCreepTo(creep, sources[0].pos);
    }
    return true;
  } else {
    console.log("Cannot find refuel sources");
    creep.say("starving...");
    return false;
  }
};

