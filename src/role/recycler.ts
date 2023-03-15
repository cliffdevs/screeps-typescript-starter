// recyclers are suicidal bots that turn themselves in for energy when their mission is complete
import * as nav from "../nav/pathfinder";
import {dumpExcessEnergy} from "../action/dump-excess-energy";
import * as logger from "../log/screeps-logger";

const creepHasEnergy = (creep: Creep) => {
  return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
};

const recycleCreep = (creep: Creep) => {
  creep.say("Kill me");
  const recycleResult = Game.spawns["Spawn1"].recycleCreep(creep);
  if (recycleResult == ERR_NOT_IN_RANGE) {
    // nav.moveCreepTo(creep, Game.spawns["Spawn1"]);
    creep.moveTo(Game.spawns["Spawn1"]);
  } else if (recycleResult != OK) {
    logger.log("Unable to recyle: " + recycleResult);
  }
};

export const run = (creep: Creep) => {
  if (creepHasEnergy(creep)) {
    dumpExcessEnergy(creep);
  } else {
    recycleCreep(creep);
  }
};
