/**
 *
 * @param {Room} room
 */
export const findEnemies = (room: Room) => {
  return room.find(FIND_HOSTILE_CREEPS);
};
