import * as creepNavigator from "../nav/pathfinder";
import * as logger from "../log/screeps-logger";

export const deliverEnergyToTarget = (creep: Creep, target: Structure) => {
  creep.say("🔄 delivering energy");

  const name = target.id;
  logger.log("Transferring energy to " + target.structureType + ":" + name);

  const transferResult = creep.transfer(target, RESOURCE_ENERGY);

  if (transferResult == ERR_NOT_IN_RANGE) {
    creepNavigator.moveCreepTo(creep, target.pos);
  } else if (transferResult !== OK) {
    logger.log("Unable to transfer because error " + transferResult);
  }
};
