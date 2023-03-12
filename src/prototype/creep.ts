import roleFunctions from "../role";

const setSpawnInMemory = (creepName: string) => {
  Memory.creeps[creepName] = Memory.creeps[creepName] || {};
  Memory.creeps[creepName].spawn =
    Memory.creeps[creepName].spawn ||
    (Game.creeps[creepName].room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_SPAWN
    })[0] as StructureSpawn).name;
};

Creep.prototype.execute = function() {
  setSpawnInMemory(this.name);
  const role = Memory.creeps[this.name].role || "builder";
  console.log("creep " + this.name + " role " + this.memory.role);
  const roleFunction = roleFunctions[role];
  roleFunction.run(this);
};
