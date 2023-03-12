import * as creepNavigator from "../nav/pathfinder";

const run = (creep: Creep) => {
  // var sources = creep.room.find(FIND_SOURCES);
  const sources = creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_SPAWN
  });

  if (sources.length > 0) {
    if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creepNavigator.moveCreepTo(creep, sources[0].pos);
    }
  } else {
    console.info("Cannot find refuel sources");
    creep.say("confused...");
  }
};

module.exports = {
  run
};
