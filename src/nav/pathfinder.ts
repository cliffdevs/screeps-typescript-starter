const visualCostMatrix = (room: string) => {
  //todo read and set color weights
};

const getColor = (creep: Creep) => {
  if (!creep.memory.path_color) {
    creep.memory.path_color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  return creep.memory.path_color;
};

const roomCallback = (roomName: string): boolean | CostMatrix => {
  let room = Game.rooms[roomName];
  if (!room) return false;

  let costs = new PathFinder.CostMatrix();

  room.find(FIND_MY_CONSTRUCTION_SITES).forEach(site => {
    // if (site.progress > )
    // costs.set(site.pos.x, site.pos.y, 255);
    costs.set(site.pos.x, site.pos.y, 10);
  });

  room.find(FIND_STRUCTURES).forEach(struct => {
    if (struct.structureType === STRUCTURE_ROAD) {
      // favor roads over all types
      costs.set(struct.pos.x, struct.pos.y, 1);
    } else if (
      struct.structureType === STRUCTURE_CONTAINER ||
      struct.structureType === STRUCTURE_WALL ||
      struct.structureType === STRUCTURE_EXTENSION ||
      struct.structureType === STRUCTURE_SPAWN ||
      struct.structureType === STRUCTURE_TOWER ||
      (struct.structureType === STRUCTURE_RAMPART && !struct.my)
    ) {
      costs.set(struct.pos.x, struct.pos.y, 255);

      // can't walk through non-walkable buildings
      costs.set(struct.pos.x, struct.pos.y, 255);
    }
  });

  // avoid creeps
  room.find(FIND_CREEPS).forEach(creep => {
    costs.set(creep.pos.x, creep.pos.y, 255);
  });

  return costs;
};

const PATH_OPTIONS: PathFinderOpts = {
  plainCost: 2,
  swampCost: 10,
  // heuristicWeight: 1.9,
  roomCallback: roomCallback
};

const drawPath = (creep: Creep, path: Array<RoomPosition>) => {
  creep.room.visual.poly(path, { stroke: getColor(creep), strokeWidth: 0.3, opacity: 0.5, lineStyle: "dashed" });
};

export const moveCreepTo = (creep: Creep, target: RoomPosition) => {
  const path = PathFinder.search(creep.pos, target, PATH_OPTIONS).path;
  drawPath(creep, path);
  const moveResult = creep.moveByPath(path);

  if (!(OK === moveResult || ERR_TIRED === moveResult)) {
    creep.say(`${moveResult}`);
    console.log(creep.name + " unable to move to target errorCode: " + moveResult);
  }

  return moveResult;
};

/**
 *
 * @param creep The creep to move. It should have a target in mind, like a flag in memory.
 * @returns false if moving, true if it is in the same room
 */
export const moveToTargetRoom = (creep: Creep) => {
  const target = creep.memory.target;
  if (target) {
    const flag = Game.flags[target];
    if (flag && creep.room.name !== flag.pos.roomName) {
      creep.say("deploy");
      creep.moveTo(flag);
      return false;
    }
  }
  return true;
}
