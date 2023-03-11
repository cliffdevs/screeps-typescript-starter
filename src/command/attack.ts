import * as spawner from '../spawn/spawner';
import * as partsConfig from "../spawn/parts-config";

const run = ({ action, from, to, squad, squadRoles }:
               { action: Action, from: string, squad: string, to: string, squadRoles: Array<string>}) => {
  console.log("prioritizing " + to);
  squadRoles
    .map(role => {
      return {
        body: partsConfig.getParts(role, from),
        name: `${from}${squad}${role}${Game.time}`,
        options: {
          memory: {
            role: role,
            action: action,
            home: from,
            target: to
          }
        }
      };
    })
    .map(creepConfig => spawner.prioritize(from, creepConfig));
};

module.exports = {
  run
};
