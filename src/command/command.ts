import AttackCommand from './attack';
import ClaimCommand from './claim';
import RecoverCommand from './recover';
import StartupCommand from "./startup";
import BaseCommand from "./basecommand";
import * as logger from "../log/screeps-logger";

interface FlagCommand {
  flagName: string;
  flag: Flag;
}

// find command flags and interpret the outcome
const actions: Record<string, BaseCommand> = {
  attack: new AttackCommand(),
  claim: new ClaimCommand(),
  recover: new RecoverCommand(),
  startup: new StartupCommand()
};

// Expect flags named like this: command.attack.from.E41N41.SquadNameHere.attacker.attacker
// the name must start with command, the next section is the action: attack/seige/claim/defend
export const convertFlagToCommand = (flagCommandOptions: FlagCommand) => {
  const commandComponents = flagCommandOptions.flag.name.split(".");
  const commandDetails: CommandConfig = {
    action: commandComponents[1],
    from: commandComponents[3],
    to: flagCommandOptions.flagName,
    squad: commandComponents[4],
    squadRoles: commandComponents.slice(5, commandComponents.length)
  };

  logger.log(JSON.stringify(commandDetails));
  return commandDetails;
};

const discoverCommands = () => {
  logger.log("Discovering commands...");
  const commands = Object.entries(Game.flags)
    .filter(([_flagName, flag]) => !flag.memory.flagAcknowledged)
    .map(([flagName, flag]) => {
      return { flagName, flag };
    })
    .map(convertFlagToCommand);

  logger.log("Found " + commands.length + " new commands.");

  return commands;
};

export const run = () => {
  const commands = discoverCommands();
  commands
    .map(command => {
      actions[command.action].run(command);
      return command;
    })
    .map(command => (Memory.flags[command.to].flagAcknowledged = true));
};

export const executeSuccessorCommand = (command: CommandConfig) => {
  actions[command.action].run(command);
}
