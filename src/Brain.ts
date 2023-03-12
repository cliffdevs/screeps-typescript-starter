"use strict";
import MemoryCleaner from "./utils/MemoryCleaner";
import * as commandExecutor from "./command/command";


import * as spawner from "./spawn/spawner";
import * as tower from "./towers";
import roleFunctions from "./role";

// prototype extension
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const prioritizeHarvester = (roomName: string) => {
    if (
      Game.rooms[roomName].controller &&
      Game.rooms[roomName].controller?.my &&
      Game.rooms[roomName].find(FIND_MY_SPAWNS).length > 0 &&
      Game.rooms[roomName].creeps.filter(
        creep => creep.memory.role === "harvester" || creep.memory.role === "remoteharvester"
      ).length === 0 &&
      spawner.getSpawnQueue(roomName) &&
      spawner.getSpawnQueue(roomName).length > 0 &&
      spawner.getSpawnQueue(roomName)[0].options.memory.role !== "remoteharvester"
    ) {
      spawner.prioritize(roomName, {
        body: [WORK, CARRY, CARRY, MOVE, MOVE],
        name: `bs${getRandomInt(10000)}`,
        options: {
          memory: {
            role: "remoteharvester",
            action: "startup",
            home: roomName,
            target: roomName
          }
        }
      });
      console.log(roomName + " prioritized a bootstrapper");
    }
  };

  /**
   * Proxy property to get a collection of all creeps in a room.
   */
  Object.defineProperty(Room.prototype, "creeps", {
    get: function () {
      return _.filter(Game.creeps, creep => creep.room.name === this.name && creep.my);
    },
    enumerable: false,
    configurable: true
  });

  Room.prototype.execute = function () {
    this.creeps.map(creep => {
      creep.execute();
    });
    spawner.run(this.name);
    tower.run(this);

    if (
      this.creeps.filter(creep => creep.memory.role === "harvester" || creep.memory.role === "remoteharvester").length ===
      0
    ) {
      console.log(`${this.name} is out of harvesters! Priorizing failsafe recovery.`);
      prioritizeHarvester(this.name);
    }
  };

// creep
  const setSpawnInMemory = (creepName: string) => {
    Memory.creeps[creepName] = Memory.creeps[creepName] || {};
    Memory.creeps[creepName].spawn =
      Memory.creeps[creepName].spawn ||
      (Game.creeps[creepName].room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_SPAWN
      })[0] as StructureSpawn).name;
  };

  Creep.prototype.execute = function () {
    setSpawnInMemory(this.name);
    const role = Memory.creeps[this.name].role || "builder";
    console.log("creep " + this.name + " role " + this.memory.role);
    const roleFunction = roleFunctions[role];
    roleFunction.run(this);
  };

/**
 * All AI logic starts here.
 */
export default class Brain {

  private memoryCleaner: MemoryCleaner;

  /**
   * Constructor for dependency injection.
   * @param {MemoryCleaner} memoryCleaner
   */
  constructor(memoryCleaner: MemoryCleaner) {
    this.memoryCleaner = memoryCleaner;
  }

  /**
   * AI logic to be executed on each tick.
   */
  loop() {
    console.log("inside brain loop")
    const isCpuBelowLimit = function() {
      const gameTimeGreaterThanOneSecond = Game.time > 1000;
      const cpuBucketLessThanTwiceCpuTickLimit = Game.cpu.bucket < Game.cpu.tickLimit * 2;
      const cpuBucketLessThanTenTimesCpuLimit = Game.cpu.bucket < Game.cpu.limit * 10;

      if (gameTimeGreaterThanOneSecond && cpuBucketLessThanTwiceCpuTickLimit && cpuBucketLessThanTenTimesCpuLimit) {
        console.log(
          `${Game.time} Skipping tick CPU Bucket too low. bucket: ${Game.cpu.bucket} tickLimit: ${Game.cpu.tickLimit} limit: ${Game.cpu.limit}`
        );
        return false;
      }

      return true;
    };

    if (!isCpuBelowLimit()) {
      return; // exit, come back next tick
    }

    Memory.time = Game.time;
    this.memoryCleaner.purge();

    commandExecutor.run();

    for (const roomName in Game.rooms) {
      Game.rooms[roomName].execute();
    }
  }
}
