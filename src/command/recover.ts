import * as spawner from "../spawn/spawner";
import * as partsConfig from "../spawn/parts-config";
import BaseCommand from "./basecommand";
import * as logger from "../log/screeps-logger";

export default class RecoverCommand extends BaseCommand {
  run(commandOptions: CommandConfig): void {
    logger.log("prioritizing " + commandOptions.to);
    commandOptions.squadRoles
      .map(role => {
        return {
          body: partsConfig.getParts(role, commandOptions.from),
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

