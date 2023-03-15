import * as creepNavigator from "../nav/pathfinder";
import * as logger from "../log/screeps-logger";

export const deliverEnergyToTarget = (creep: Creep, target: any) => {
  logger.log(`method=deliverEnergyToTarget creep=${creep.name} room=${creep.room.name} target=${target.name || target.id} START}`)
  creep.say("🔄 delivering energy");

  const name = target.name || target.id;
  logger.log("Transferring energy to " + target.structureType + ":" + name);

  const transferResult = creep.transfer(target, RESOURCE_ENERGY);

  if (transferResult == ERR_NOT_IN_RANGE) {
    creepNavigator.moveCreepTo(creep, target);
  } else if (transferResult !== OK) {
    logger.log(`room: ${creep.room.name} creep: ${creep.name} unable to transfer because error ${transferResult}`);
  }
  logger.log(`method=deliverEnergyToTarget creep=${creep.name} room=${creep.room.name} target=${target.name || target.id} END}`)
};
