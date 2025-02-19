import * as creepMover from "../nav/pathfinder";
import * as containerRefueler from "../action/refuel-from-container";
import * as sourceRefueler from "../action/refuel-from-energy-source";
import { deliverEnergyToTarget } from "../action/transfer-energy";
import { queueSuccessor } from "action/queue-successor";
import * as droppedRefueler from "../action/refuel-from-dropped-energy";
import * as mineRefueler from "../action/refuel-from-energy-source";

/**
 * Return a single tower object if one exists needing energy
 * @param {Creep} creep
 */
const locateNearestTowerNeedingFuel = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: structure =>
      structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });
};

export const run = (creep: Creep) => {
  queueSuccessor(creep);
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.upgrading = false;
    creep.say("🔄 refuel");
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.upgrading = true;
    creep.say("⚡ upgrade");
  }

  if (creep.memory.upgrading) {
    const towerNeedingFuel = locateNearestTowerNeedingFuel(creep);
    if (towerNeedingFuel) {
      creep.say("tower found");
      deliverEnergyToTarget(creep, towerNeedingFuel);
    } else if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creepMover.moveCreepTo(creep, creep.room.controller.pos);
    }
  } else {
    if (!droppedRefueler.run(creep) || !containerRefueler.run(creep)) {
      mineRefueler.run(creep);
    }
  }
}
