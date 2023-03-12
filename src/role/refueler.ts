// refuelers are tower specific couriers
import { deliverEnergyToTarget } from "../action/transfer-energy";
import {locateNearestTowerNeedingFuel} from "../action/locate-nearest-tower-needing-fuel";

export const run = (creep: Creep) => {
  const towerNeedingFuel = locateNearestTowerNeedingFuel(creep);
  if (towerNeedingFuel) {
    deliverEnergyToTarget(creep, towerNeedingFuel);
  }
};
