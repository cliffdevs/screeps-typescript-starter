import * as  buildActions from "./find-nearest-construction";
import {deliverEnergyToTarget} from "./deliver-energy-to-target";
import {locateNearestTowerNeedingFuel} from "./locate-nearest-tower-needing-fuel";
import * as creepNavigator from "../nav/pathfinder";
import * as logger from "../log/screeps-logger";

export const dumpExcessEnergy = (creep: Creep) => {
  if (creep.memory.spawn && creep.room.name === Game.spawns[creep.memory.spawn].room.name) {
    creep.say("excess");
    logger.log(creep.name + " has excess energy");
    // build things first
    const site = buildActions.findNearestConstructionSite(creep);
    if (site) {
      creep.say("build");
      buildActions.constructTarget(creep, site);
    } else {
      const towerNeedingFuel = locateNearestTowerNeedingFuel(creep);
      if (towerNeedingFuel) {
        deliverEnergyToTarget(creep, towerNeedingFuel);
      } else if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creepNavigator.moveCreepTo(creep, creep.room.controller.pos);
      }
    }
    // // if empty
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.delivering = false;
    }
  } else {
    const spawnName =
      creep.memory.spawn ||
      creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_SPAWN
      }).map(structure => structure as StructureSpawn)[0].name;
    creep.moveTo(Game.spawns[spawnName]);
  }
};
