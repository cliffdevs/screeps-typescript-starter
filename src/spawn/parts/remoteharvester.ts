const energyTiers = [300];

const partTiers: Record<number, Array<BodyPartConstant>> = {
  300: [WORK, CARRY, CARRY, MOVE, MOVE]
};

const sortHighestToLowest = (t1: number, t2: number) => (t1 > t2 ? -1 : 1);

const filterCurrentCapacityGreaterThan = (capacity: number) => (tier: number) => capacity >= tier;

const selectPartTier = (roomName: string) => {
  const capacity = Game.rooms[roomName].energyCapacityAvailable;
  return energyTiers.filter(filterCurrentCapacityGreaterThan(capacity)).sort(sortHighestToLowest)[0];
};

export const getParts = (roomName: string) => {
  return partTiers[selectPartTier(roomName)];
};

