import * as creepNavigator from "../nav/pathfinder";

const deliverEnergyToTarget = (creep: Creep, target: Structure) => {
  creep.say("🔄 delivering energy");

  const name = target.id;
  console.log("Transferring energy to " + target.structureType + ":" + name);

  const transferResult = creep.transfer(target, RESOURCE_ENERGY);

  if (transferResult == ERR_NOT_IN_RANGE) {
    creepNavigator.moveCreepTo(creep, target.pos);
  } else if (transferResult !== OK) {
    console.log("Unable to transfer because error " + transferResult);
  }
};

module.exports = {
  deliverEnergyToTarget
};
