"use strict";
/**
 * The courier is a role for creeps to discover dropped resources and carry them to storage.
 * They combo well with drop mining strategies.
 */

import * as nav from "../nav/pathfinder";
import * as locationUtils from "../util/locate";

/**
 *
 * @param {Creep} creep
 * @param {Structure} target
 */
const deliverEnergyToTarget = (creep: Creep, target:  StructureExtension | StructureSpawn | StructureStorage | StructureContainer) => {
  creep.say("🔄 delivering energy");

  const name = target.id;
  console.log("Transferring energy to " + target.structureType + ":" + name);

  const transferResult = creep.transfer(target, RESOURCE_ENERGY);

  if (transferResult == ERR_NOT_IN_RANGE) {
    nav.moveCreepTo(creep, target.pos);
  } else if (transferResult !== OK) {
    console.log("Unable to transfer because error " + transferResult);
  }
};

/**
 *
 * @param {Creep} creep
 */
const findAndPickupDroppedEnergy = (creep: Creep) => {
  const foundEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
  if (foundEnergy) {
    // creep.say("pickup");
    const pickupResult = creep.pickup(foundEnergy);
    if (pickupResult == ERR_NOT_IN_RANGE) {
      nav.moveCreepTo(creep, foundEnergy.pos);
    } else if (pickupResult != OK) {
      creep.say("err" + pickupResult);
    }
  } else {
    creep.say("bored");
  }
};

/**
 *
 * @param {Creep} creep
 */
const carryEnergyToStorage = (creep: Creep) => {

  const target = locationUtils.findClosestEnergyStorage(creep);
  if (target) {
    creep.say("deliver");
    deliverEnergyToTarget(creep, target);
    // // if empty
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      creep.memory.delivering = false;
    }
  } else {
    creep.say("holding");
  }
};

/**
 *
 * @param {Creep} creep
 */
export const run = (creep: Creep) => {
  if (!creep.memory.delivering && creep.store.getFreeCapacity() > 0) {
    findAndPickupDroppedEnergy(creep);
  } else {
    creep.memory.delivering = true;
    carryEnergyToStorage(creep);
  }
};
