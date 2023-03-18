/**
 * Attacker is a role for creeps to go out and fight for objects in rooms.
 */

import { queueSuccessor } from "action/queue-successor";
import {moveCreepTo, moveToTargetRoom} from "nav/pathfinder";

/**
 * execute the attack logic.
 * @param {Creep} creep
 */
export const run = (creep: Creep) => {
  queueSuccessor(creep);
  if (!moveToTargetRoom(creep)) {
    return;
  }

  const creepTarget = creep.memory.target;
  if (creepTarget) {
    const flag = Game.flags[creepTarget];
    if (creep) {
      Memory.rooms = Memory.rooms ? Memory.rooms : {};
      Memory.rooms[flag.pos.roomName] = Memory.rooms[flag.pos.roomName] ? Memory.rooms[flag.pos.roomName] : {};
      Memory.rooms[flag.pos.roomName].attackers = Memory.rooms[flag.pos.roomName].attackers || [];
      if (!Memory.rooms[flag.pos.roomName].attackers?.includes(creep.name)) {
        Memory.rooms[flag.pos.roomName].attackers?.push(creep.name);
      }
      if (creep.room.name === flag.pos.roomName) {
        let spawnToStepOnAndDestroy = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
        if (spawnToStepOnAndDestroy) {
          moveCreepTo(creep, spawnToStepOnAndDestroy.pos);
          return;
        }
        const closestHostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS) as Creep;
        const outcome = creep.attack(closestHostileCreep);
        creep.say("smack");
        if (outcome == ERR_NOT_IN_RANGE) {
          const moveResult = moveCreepTo(creep, closestHostileCreep.pos);
          creep.say(`${moveResult}`);
        }
      } else {
        creep.say(flag.name);
        moveCreepTo(creep, flag.pos);
      }
    }
  }
};
