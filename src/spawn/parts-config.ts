const partsProviders = require("./parts");

export const getParts = (role: string, roomName: string) => {
  return partsProviders[role].getParts(roomName);
};

