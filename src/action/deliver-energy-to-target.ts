import * as creepNavigator from "../nav/pathfinder";

export const deliverEnergyToTarget = (creep: Creep, target: any) => {
  console.log(`method=deliverEnergyToTarget creep=${creep.name} room=${creep.room.name} target=${target.name || target.id} START}`)
  creep.say("🔄 delivering energy");

  const name = target.name || target.id;
  console.log("Transferring energy to " + target.structureType + ":" + name);

  const transferResult = creep.transfer(target, RESOURCE_ENERGY);

  if (transferResult == ERR_NOT_IN_RANGE) {
    creepNavigator.moveCreepTo(creep, target);
  } else if (transferResult !== OK) {
    console.log(`room: ${creep.room.name} creep: ${creep.name} unable to transfer because error ${transferResult}`);
  }
  console.log(`method=deliverEnergyToTarget creep=${creep.name} room=${creep.room.name} target=${target.name || target.id} END}`)
};
