import { log } from "log/screeps-logger";
import partsProviders from "./parts/index";

export const getParts = (role: string, roomName: string): Array<BodyPartConstant> => {
  const rolePartsProvider = partsProviders[role];
  if (rolePartsProvider) {
    return rolePartsProvider.getParts(roomName);
  }

  log(`Unable to lookup parts for role=${role} in roomName=${roomName}`);
  return [];
};

