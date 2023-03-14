import { convertFlagToCommand, executeSuccessorCommand } from "command/command";

export const queueSuccessor = (creep: Creep) => {
    if (creep.ticksToLive && creep.ticksToLive < 60 && !creep.memory.successorRequested && creep.memory.target) {
        const flag = Game.flags[creep.memory.target];
        if (flag) {
            const successorCommand = convertFlagToCommand({
                flag: flag,
                flagName: flag.name
            });
            successorCommand.squadRoles = [creep.memory.role];
            executeSuccessorCommand(successorCommand);
            creep.memory.successorRequested = true;
        }
    }
}
