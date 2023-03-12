import partsProviders from "./parts";

export const getParts = (role: string, roomName: string) => {
  return partsProviders[role].getParts(roomName);
};

