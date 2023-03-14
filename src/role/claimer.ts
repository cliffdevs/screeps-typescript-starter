/**
 * Claimer's will claim a room controller.
 */

import { queueSuccessor } from "action/queue-successor";
import { room } from "prototype";

// const creepMover = require("../nav/pathfinder");

/**
 *
 * @param {Creep} creep
 */
export const run = (creep: Creep) => {
  queueSuccessor(creep);
  const target = creep.memory.target;
  if (target) {
    const flag = Game.flags[target];
    if (flag) {
      Memory.rooms = Memory.rooms ? Memory.rooms : {};
      Memory.rooms[flag.pos.roomName] = Memory.rooms[flag.pos.roomName] ? Memory.rooms[flag.pos.roomName] : {};
      Memory.rooms[flag.pos.roomName].claimer = creep.name;
      if (creep.room.name === flag.pos.roomName) {
        const controller = Game.rooms[flag.pos.roomName].find(FIND_STRUCTURES, {
          filter: struct => struct.structureType === STRUCTURE_CONTROLLER
        }).map(structure => structure as StructureController)[0];
        creep.say("attack!");
        const result = creep.attackController(controller);
        if (result == ERR_NOT_IN_RANGE) {
          creep.say("close in");
          const moveResult = creep.moveTo(controller);
          if (moveResult != OK) {
            console.log("attack move failed because " + moveResult);
          }
        } else if (result == ERR_INVALID_TARGET) {
          creep.claimController(controller);
          creep.reserveController(controller);
        } else if (result != OK) {
          console.log("attack controller failed because " + result);
        } else if (result == OK) {
          creep.say("success");
          console.log("ATTACK SUCCEEDED");
          if (creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTROLLER
          }).length > 0) {
            // recycle creep after completing its mission of claiming this controller
            creep.memory.role = "recycler";
          }
        }
      } else {
        creep.say("deploy");
        creep.moveTo(flag);
      }
    }
  }
};
