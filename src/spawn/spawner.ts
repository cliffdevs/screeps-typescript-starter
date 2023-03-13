import spawnConfig from "./spawn-config";
import * as partsConfig from "./parts-config";
import * as spawnSelector from "./spawn-selector";
import allRoles from "../role/role-names";
import * as spawnOpts from "./spawn-opts";

const getRoomMemory = (roomName: string) => {
  Memory.rooms = Memory.rooms || {};
  return (Memory.rooms[roomName] = Memory.rooms[roomName] || {});
};

const getPendingSpawnCounters = (roomName: string) => {
  const roomMemory = getRoomMemory(roomName);
  roomMemory.pendingSpawnCounters = roomMemory.pendingSpawnCounters || {};
  return roomMemory.pendingSpawnCounters;
};

const getPendingCounterForRole = (roomName: string, role: string) => {
  const pendingSpawnCounters = getPendingSpawnCounters(roomName);
  return pendingSpawnCounters[role] || 0;
};

const increasePendingCounter = (roomName: string, creepConfig: CreepConfig) => {
  const pendingSpawnCounters = getPendingSpawnCounters(roomName);
  const role = creepConfig.options.memory.role;
  const pendingSpawnCountersForRole = pendingSpawnCounters[role] ?? 0;
  pendingSpawnCounters[role] = pendingSpawnCountersForRole + 1;
};

const decreasePendingCounter = (roomName: string, creepConfig: CreepConfig) => {
  const pendingSpawnCounters = getPendingSpawnCounters(roomName);
  const role = creepConfig.options.memory.role;
  const pendingSpawnCountersForRole = pendingSpawnCounters[role] ?? 1;
  pendingSpawnCounters[role] = pendingSpawnCountersForRole - 1;
};

export const getSpawnQueue = (roomName: string) => {
  const roomMemory = getRoomMemory(roomName);
  return (roomMemory.spawnQueue = roomMemory.spawnQueue || []);
};

const pushSpawnQueue = (roomName: string, creepConfig: CreepConfig) => {
  const spawnQueue = getSpawnQueue(roomName);
  spawnQueue.push(creepConfig);
  increasePendingCounter(roomName, creepConfig);
};

const popSpawnQueue = (roomName: string) => {
  const spawnQueue = getSpawnQueue(roomName);
  const creepConfig = spawnQueue.shift();
  if (creepConfig) {
    decreasePendingCounter(roomName, creepConfig);
    return creepConfig;
  }
  return undefined;
};

const peekSpawnQueue = (roomName: string) => {
  const spawnQueue = getSpawnQueue(roomName);
  if (spawnQueue.length > 0) {
    return spawnQueue[0];
  }

  return null;
};

const unshiftSpawnQueue = (roomName: string, creepConfig: CreepConfig) => {
  const spawnQueue = getSpawnQueue(roomName);
  spawnQueue.unshift(creepConfig);
};

const queueSpawnsForRole = (role: string, roomName: string) => {
  const workers = _.filter(Game.creeps, creep => creep.memory.role === role);
  console.log(`${role}'s: ` + workers.length);

  const roomLevel = Game.rooms[roomName]?.controller?.level;
  if (roomLevel) {
    console.log(`workers.length ${workers.length}`);
    console.log(`roomName ${roomName} role ${role}`);
    console.log(`pending ${getPendingCounterForRole(roomName, role)} `);
    console.log(`config ${spawnConfig[roomLevel][role]}`);
    if (workers.length + getPendingCounterForRole(roomName, role) < spawnConfig[roomLevel][role]) {
      const newName = role + Game.time;
      const creepConfig: CreepConfig = {
        body: partsConfig.getParts(role, roomName),
        name: newName,
        options: spawnOpts.getSpawnOptions(roomName, role)
      };
      console.log("Pushing creep to spawnqueue: " + JSON.stringify(creepConfig));
      pushSpawnQueue(roomName, creepConfig);
    }
  }
};

const attemptToSpawn = (roomName: string) => {
  const targetSpawner = spawnSelector.discoverSpawner(roomName);
  if (targetSpawner && !targetSpawner.spawning) {
    const creepConfig = peekSpawnQueue(roomName);
    console.log(roomName + " will attempt to spawn creepConfig " + JSON.stringify(creepConfig));
    if (creepConfig) {
      const result = targetSpawner.spawnCreep(creepConfig.body, creepConfig.name, creepConfig.options);
      console.log(roomName + " spawn result is " + result);
      if (result === OK) {
        popSpawnQueue(roomName);
        const spawnConfig = targetSpawner.spawning;
        if (spawnConfig) {
          const spawningCreepConfig = spawnConfig as CreepConfig;
          const spawnCreep = spawningCreepConfig.name;
          targetSpawner.room.visual.text("🛠️" + spawnCreep, targetSpawner.pos.x + 1, targetSpawner.pos.y, {
            align: "left",
            opacity: 0.8
          });

          spawnSelector.incrementSpawner(roomName);
        }
      }
    }
  }
};

const queueAllSpawns = (roomName: string) => {
  allRoles.forEach(role => queueSpawnsForRole(role, roomName));
};

export const run = function(roomName: string) {
  queueAllSpawns(roomName);
  attemptToSpawn(roomName);
};

export const prioritize = function(roomName: string, creepConfig: CreepConfig) {
  unshiftSpawnQueue(roomName, creepConfig);
};
