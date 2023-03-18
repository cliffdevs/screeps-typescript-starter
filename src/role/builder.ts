/**
 * Builder is a role that will work on construction sites or repair damaged structures.
 */
import * as creepMover from "../nav/pathfinder";
import * as droppedRefueler from "../action/refuel-from-dropped-energy";
import * as containerRefueler from "../action/refuel-from-container";
import * as mineRefueler from "../action/refuel-from-energy-source";
import { queueSuccessor } from "action/queue-successor";
import * as logger from "../log/screeps-logger";

const MIN_WALL_HEALTH = 5000;

const constructTarget = (creep: Creep, target: ConstructionSite) => {
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    logger.log("Creep " + creep.name + " moving to " + target.structureType + ":" + target.id);
    creepMover.moveCreepTo(creep, target.pos);
  }
};

const findNearestThingToRepair = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: object => {
      return (
        (object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax / 3) ||
        (object.structureType == STRUCTURE_CONTAINER && object.hits < object.hitsMax / 3) ||
        (object.structureType == STRUCTURE_WALL && object.hits < MIN_WALL_HEALTH) ||
        (object.structureType == STRUCTURE_RAMPART && object.hits < MIN_WALL_HEALTH)
      );
    }
  });
};

const repairThing = (creep: Creep, toRepair: Structure) => {
  if (toRepair) {
    creep.say("fixing");
    creepMover.moveCreepTo(creep, toRepair.pos);
    creep.repair(toRepair);
  }
};

const findNearestConstructionSite = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
};

export const run = (creep: Creep) => {
    queueSuccessor(creep);
    if (!creepMover.moveToTargetRoom(creep)) {
      return;
    }

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (!creep.memory.building) {
      if (!droppedRefueler.run(creep) || !containerRefueler.run(creep)) {
        mineRefueler.run(creep);
      }
    }
    if (creep.memory.building) {
      const constructionTarget = findNearestConstructionSite(creep);

      if (constructionTarget) {
        constructTarget(creep, constructionTarget);
      } else {
        const toRepair = findNearestThingToRepair(creep);
        if (toRepair) {
          creep.say("repair");
          repairThing(creep, toRepair);
        } else if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.say("upgrade");
          creepMover.moveCreepTo(creep, creep.room.controller.pos);
        }
      }
    }
};
