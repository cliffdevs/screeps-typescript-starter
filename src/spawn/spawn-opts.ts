const getMinerEnergySource = (roomName: string, role: string) => {
  const roomMemory = (Memory.rooms[roomName] = Memory.rooms[roomName] || {});
  const sources = (roomMemory.sources =
    roomMemory.sources || Game.rooms[roomName].find(FIND_SOURCES).map(source => source.id));
  if (sources && sources.length > 0) {
    roomMemory.previousSourceIndex = roomMemory.previousSourceIndex || 0;
    let targetSourceIndex = roomMemory.previousSourceIndex + 1;
    if (targetSourceIndex >= roomMemory.sources.length) {
      targetSourceIndex = 0;
    }

    if (role === "maxharvester") {
      // only toggle sources for max harvesters, the others should
      // balance well enough by sourcing from containers
      roomMemory.previousSourceIndex = targetSourceIndex;
    }

    return sources[targetSourceIndex];
  }

  return -1;
};

/**
 * Provide custom spawn options for the target creep based on the room and role it will take.
 * @param {string} roomName the name of the room.
 * @param {string} role the name of the creeps role.
 */
export const getSpawnOptions = (roomName: string, role: string) => {
  return {
    memory: {
      role: role
    },
    energySource: getMinerEnergySource(roomName, role)
  };
};
