import * as buildCommands from "../action/find-nearest-construction";

export const getCreepsByRoomName = (roomName: string) => {
  return Game.rooms[roomName].find(FIND_CREEPS);
};

export const getCreepByName = (creepName: string) => {
  return Game.creeps[creepName];
};

export const dumpResources = (creepName: string) => {
  const creep = getCreepByName(creepName);
  const copyRole = creep.memory.role;
  creep.memory.role = "none";
  const site = buildCommands.findNearestConstructionSite(creep);
  if (site) {
    buildCommands.constructTarget(creep, site);
    creep.memory.role = copyRole;
  }
};

export const changeRole = (creepName: string, role: string) => {
  const creep = getCreepByName(creepName);
  creep.memory.role = role;
};
