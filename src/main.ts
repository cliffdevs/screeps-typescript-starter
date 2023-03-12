import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definition alone.
          You must also give them an implementation if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
    time: number;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working?: boolean;
    spawn?: string;
    path_color?: string;
    delivering?: boolean;
    energySource?: string;
  }

  interface RoomMemory {
    pendingSpawnCounters?: Record<string, number>;
    spawnQueue?: Array<CreepConfig>;
    sources?: Array<string>;
    previousSourceIndex?: number;
    spawners?: Array<string>;
    spawnerIndex?: number;
  }

  interface FlagMemory {
    flagAcknowledged: boolean;
  }

  interface Room {
    creeps: Array<Creep>;
    execute: () => void;
  }

  interface Creep {
    execute: () => void;
  }

  interface CreepConfig {
    body: any;
    name: string;
    options: any;
  }

  interface CommandConfig {
    action: string;
    from: string;
    to: string;
    squad: string;
    squadRoles: Array<string>;
  }

  interface Command {
    run: (commandConfig: CommandConfig) => void;
  }

  // Syntax for adding properties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`tick=${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
