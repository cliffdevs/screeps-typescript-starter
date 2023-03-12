// harvesters are basic multi purpose miners that take on the responsibility of energy delivery
// in addition to mining.

import * as creepNavigator from "../nav/pathfinder";
import * as mineRefueler from "../action/refuel-from-energy-source";
import {deliverEnergyToTarget} from "../action/deliver-energy-to-target";
import {dumpExcessEnergy} from "../action/dump-excess-energy";

const findEnergyStorageLocations = (creep: Creep) => {
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

/** @param {Creep} creep **/
export const run = (creep: Creep) => {
  if (!creep.memory.delivering && creep.store.getFreeCapacity() > 0) {
    mineRefueler.run(creep);
  } else {
    creep.memory.delivering = true;

    const dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (dropped && creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
      creepNavigator.moveCreepTo(creep, dropped.pos);
    }

    const targets = findEnergyStorageLocations(creep);
    console.log("energy storage targets: " + targets.length);
    if (targets.length > 0) {
      creep.say("deliver");
      deliverEnergyToTarget(creep, targets[0]);

      // // if empty
      if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
        creep.memory.delivering = false;
      }
    } else {
      dumpExcessEnergy(creep);
    }
  }
}

/**
 * harvester ai
 *
 * Gather energy resources
 * 1. Gather from source in memory
 *
 * Spend energy in the following order:
 * 1. Fill extensions
 * 2. Fill spawner
 * 3. Fill containers
 * 4. Construct stuff
 * 5. Fix Stuff
 * 6. Upgrade Room Controller
 */
