const energyTiers = [300, 550, 800, 1100, 1400, 1700, 5300, 12000];

const partTiers: Record<number, Array<BodyPartConstant>> = {
  300: [WORK, CARRY, CARRY, MOVE, MOVE],
  550: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  800: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  1100: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  1400: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  1700: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  5300: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  12000: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
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
