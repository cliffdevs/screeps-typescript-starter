// remote miners are harvesters for foreign rooms.
// const creepMover = require("../nav/pathfinder");

import * as roleHavester from "./harvester";
import {moveCreepTo} from "../nav/pathfinder";

/**
 *
 * @param {Creep} creep
 */
export const run = (creep: Creep) => {
  const flag = Game.flags["Mine"];
  if (flag) {
    if (creep) {
      Memory.rooms = Memory.rooms ? Memory.rooms : {};
      Memory.rooms[flag.pos.roomName] = Memory.rooms[flag.pos.roomName] ? Memory.rooms[flag.pos.roomName] : {};
      Memory.rooms[flag.pos.roomName].miners = Memory.rooms[flag.pos.roomName].miners || [];
      if (!Memory.rooms[flag.pos.roomName].miners?.includes(creep.name)) {
        Memory.rooms[flag.pos.roomName].miners?.push(creep.name);
      }
      if (creep.room.name === flag.pos.roomName) {
        roleHavester.run(creep);
      } else {
        creep.say(flag.name);
        moveCreepTo(creep, flag.pos);
        // creepMover.moveCreepTo(creep, flag);
      }
    }
  }
};
module.exports = {
  run
};
