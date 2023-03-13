/**
 * Attacker is a role for creeps to go out and fight for objects in rooms.
 */
import * as harvesterLogic from "./harvester";
import * as dumpExcess from "../action/dump-excess-energy";

/**
 * execute the attack logic.
 * @param {Creep} creep
 */
export const run = (creep: Creep) => {
  const target = creep.memory.target;
  if (target) {
    const flag = Game.flags[target];
    const roomName = flag?.pos.roomName ?? creep.memory.target;

    if (creep.room.name === roomName) {
      creep.memory.role = "harvester";
    } else {
      creep.say(flag.name);
      creep.moveTo(flag.pos);
    }
  }
};
