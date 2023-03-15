import * as logger from "../log/screeps-logger";

const getRoomMemory = (roomName: string) => {
  return (Memory.rooms[roomName] = Memory.rooms[roomName] || {});
};

export const getSpawners = (roomName: string) => {
  const roomMemory = getRoomMemory(roomName);
  roomMemory.spawners = roomMemory.spawners || [];
  if (roomMemory.spawners.length === 0) {
    roomMemory.spawners = Game.rooms[roomName]
      .find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_SPAWN })
      .map(obj => obj as StructureSpawn)
      .map(obj => obj.name);
  }

  return roomMemory.spawners;
};

const getSpawnerIndex = (roomName: string) => {
  const roomMemory = getRoomMemory(roomName);
  return (roomMemory.spawnerIndex = roomMemory.spawnerIndex ?? 0);
};

export const discoverSpawner = (roomName: string) => {
  const spawners = getSpawners(roomName);

  if (spawners.length > 0) {
    const targetSpawnerIndex = getSpawnerIndex(roomName);
    logger.log("room: " + roomName + " spawner: " + spawners[targetSpawnerIndex]);
    return Game.spawns[spawners[targetSpawnerIndex]];
  }

  return null;
};

export const incrementSpawner = (roomName: string) => {
  const roomMemory = getRoomMemory(roomName);
  const spawners = getSpawners(roomName);
  const spawnerIndex = getSpawnerIndex(roomName);
  roomMemory.spawnerIndex = spawnerIndex + 1 >= spawners.length ? 0 : spawnerIndex + 1;
};
