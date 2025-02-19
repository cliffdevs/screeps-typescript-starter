// maxharvesters are drop miners, they require couriers to be effective
import * as mineRefueler from "../action/refuel-from-energy-source";

export const run = (creep: Creep) => {
    if (creep.store.getFreeCapacity() > 0) {
      mineRefueler.run(creep);
    } else {
      creep.drop(RESOURCE_ENERGY);
    }
  };
