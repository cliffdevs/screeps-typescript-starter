"use strict";

/**
 * Utility for reclaiming memory.
 */
export default class MemoryCleaner {
  constructor() {}

  /**
   * Remove unused creeps from memory.
   */
  purge() {
    for (const creepName in Memory.creeps) {
      if (!Game.creeps[creepName]) {
        delete Memory.creeps[creepName];
      }
    }
  }
}
