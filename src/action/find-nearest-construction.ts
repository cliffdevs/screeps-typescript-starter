import * as creepMover from "../nav/pathfinder";

export const constructTarget = (creep: Creep, target: ConstructionSite<BuildableStructureConstant>) => {
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    console.log("Creep " + creep.name + " moving to " + target.structureType + ":" + target.id);
    creepMover.moveCreepTo(creep, target.pos);
  }
};

export const findNearestThingToRepair = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: object => {
      return (
        (object.structureType == STRUCTURE_ROAD && object.hits < object.hitsMax / 3) ||
        (object.structureType == STRUCTURE_WALL && object.hits < object.hitsMax / 10) ||
        (object.structureType == STRUCTURE_RAMPART && object.hits < object.hitsMax / 10)
      );
    }
  });
};

export const repairThing = (creep: Creep, toRepair: Structure) => {
  if (toRepair) {
    creep.say("fixing");
    creepMover.moveCreepTo(creep, toRepair.pos);
    creep.repair(toRepair);
  }
};

export const findNearestConstructionSite = (creep: Creep) => {
  return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
};
