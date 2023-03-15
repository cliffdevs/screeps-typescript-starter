import * as creepNavigator from "../nav/pathfinder";
import * as logger from "../log/screeps-logger";

export const findNearestEnergySource = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_SOURCES);
};

export const findFirstEnergySource = (creep: Creep) => {
  return creep.room.find(FIND_SOURCES_ACTIVE);
};

export const getEnergySource = (creep: Creep) => {
  if (creep.memory.energySource) {
    return creep.room.find(FIND_SOURCES, {
      filter: source => {
        return source.id === creep.memory.energySource;
      }
    })[0];
  }

  logger.log("ERROR, creep couldn't find it's assigned energy source and will default to nearest.");
  const source = findNearestEnergySource(creep);
  creep.memory.energySource = source?.id;
  return source;
};

export const run = (creep: Creep) => {
  creep.say("🔄 harvest");

  const source = getEnergySource(creep);
  if (source) {
    const harvestResult = creep.harvest(source);
    if (harvestResult == ERR_NOT_IN_RANGE) {
      creepNavigator.moveCreepTo(creep, source.pos);
    }
  }
};
