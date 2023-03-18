import spawnConfig from "./spawn-config";
import * as partsConfig from "./parts-config";
import * as spawnSelector from "./spawn-selector";
import allRoles from "../role/role-names";
import * as spawnOpts from "./spawn-opts";
import * as logger from "../log/screeps-logger";
import { mapScreepsReturnCode } from "utils/resultcodemapper";

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
  if (!(creepConfig.options as CreepMemory).target) {
    const pendingSpawnCounters = getPendingSpawnCounters(roomName);
    const role = creepConfig.options.memory.role;
    const pendingSpawnCountersForRole = pendingSpawnCounters[role] ?? 0;
    pendingSpawnCounters[role] = pendingSpawnCountersForRole + 1;
  }
};

const decreasePendingCounter = (roomName: string, creepConfig: CreepConfig) => {
  const pendingSpawnCounters = getPendingSpawnCounters(roomName);
  const role = creepConfig.options.memory.role;
  const pendingSpawnCountersForRole = pendingSpawnCounters[role] ?? 1;
  const calculateWithCounter = pendingSpawnCountersForRole > 0 ? pendingSpawnCountersForRole : 1;
  pendingSpawnCounters[role] = calculateWithCounter - 1;
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
  if (creepConfig && !(creepConfig.options as CreepMemory)?.target) {
    decreasePendingCounter(roomName, creepConfig);
    return creepConfig;
  }
  return undefined;
};

const peekSpawnQueue = (roomName: string): CreepConfig | null => {
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
  logger.log(`${role}'s: ` + workers.length);

  const roomLevel = Game.rooms[roomName]?.controller?.level;
  if (roomLevel) {
    logger.log(`workers.length ${workers.length}`);
    logger.log(`roomName ${roomName} role ${role}`);
    logger.log(`pending ${getPendingCounterForRole(roomName, role)} `);
    logger.log(`config ${spawnConfig[roomLevel][role]}`);
    if (workers.length + getPendingCounterForRole(roomName, role) < spawnConfig[roomLevel][role]) {
      const newName = role + Game.time;
      const creepConfig: CreepConfig = {
        body: partsConfig.getParts(role, roomName),
        name: newName,
        options: spawnOpts.getSpawnOptions(roomName, role)
      };
      if (creepConfig.body.length > 0) {
        logger.log("Pushing creep to spawnqueue: " + JSON.stringify(creepConfig));
        pushSpawnQueue(roomName, creepConfig);
      } else {
        logger.log(`UNABLE TO LOOKUP PART role=${role} roomName=${roomName}`);
      }
    }
  }
};

const attemptToSpawn = (roomName: string) => {
  const targetSpawner = spawnSelector.discoverSpawner(roomName);
  if (targetSpawner && !targetSpawner.spawning) {
    const creepConfig = peekSpawnQueue(roomName);
    logger.log(roomName + " will attempt to spawn creepConfig " + JSON.stringify(creepConfig));
    if (creepConfig) {
      const result = targetSpawner.spawnCreep(creepConfig.body, creepConfig.name, creepConfig.options);
      const resultName = mapScreepsReturnCode(result);
      logger.log(roomName + " spawn result is " + mapScreepsReturnCode(result));
      if (result === ERR_NOT_ENOUGH_ENERGY && (creepConfig.options as CreepMemory).role) {
        // double check that we haven't lost capacity to create this with the parts
        const adjustedParts = partsConfig.getParts((creepConfig.options as CreepMemory).role, roomName);
        if (adjustedParts.length > 0 && creepConfig.body != adjustedParts) {
          logger.log("Parts for pending creep are different for this level, adjusting");
          creepConfig.body = adjustedParts;
          getSpawnQueue(roomName)[0] = creepConfig;
        }
      }
      if (result === ERR_NAME_EXISTS) {
        getSpawnQueue(roomName)[0].name += '0';
      }
      if (result === ERR_INVALID_ARGS) {
        logger.log({
          spawner: targetSpawner.name,
          resultCode: result,
          resultCodeName: resultName,
          creepConfig
        });
        logger.log('Resetting spawn queue to clean bad data');
        const roomMemory =  Game.rooms[targetSpawner.room.name].memory;
        delete roomMemory.pendingSpawnCounters
        delete roomMemory.spawnQueue;
      }
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
