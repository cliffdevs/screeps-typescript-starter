import * as spawner from '../spawn/spawner';
import * as partsConfig from "../spawn/parts-config";
import BaseCommand from "./basecommand";

export default class AttackCommand extends BaseCommand {
  run(commandConfig: CommandConfig): void {
    console.log("prioritizing " + commandConfig.to);
    commandConfig.squadRoles
      .map(role => {
        return {
          body: partsConfig.getParts(role, commandConfig.from),
          name: `${(commandConfig.from)}${(commandConfig.squad)}${role}${Game.time}`,
          options: {
            memory: {
              role: role,
              action: commandConfig.action,
              home: commandConfig.from,
              target: commandConfig.to
            }
          }
        };
      })
      .map(creepConfig => spawner.prioritize(commandConfig.from, creepConfig));
  }
}
