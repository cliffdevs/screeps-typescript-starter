import BaseCommand from "./basecommand";
import * as spawner from "../spawn/spawner"
import * as partsConfig from "../spawn/parts-config";

export default class ClaimCommand extends BaseCommand {
  run(commandOptions: CommandConfig): void {
    console.log("prioritizing " + commandOptions.to);
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
