import * as spawner from "../spawn/spawner";
import BaseCommand from "./basecommand";
import * as logger from "../log/screeps-logger";

export default class StartupCommand extends BaseCommand {
  run(commandOptions: CommandConfig): void {
    logger.log("prioritizing " + commandOptions.to);
    commandOptions.squadRoles
      .map(role => {
        return {
          body: [WORK, CARRY, CARRY, MOVE, MOVE],
          name: `${(commandOptions.from)}${(commandOptions.squad)}${role}${Game.time}`,
          options: {
            memory: {
              role: role,
              action: commandOptions.action,
              home: commandOptions.from,
              target: commandOptions.to
            }
          }
        };
      })
      .map(creepConfig => spawner.prioritize(commandOptions.from, creepConfig));
  }
}
