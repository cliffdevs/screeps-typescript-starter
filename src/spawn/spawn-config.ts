/**
 * Contains a config mapping of how many of each role of screep to
 * have spawned on hand at each room controller level.
 */
export default {
  1: {
    attacker: 0,
    builder: 1,
    claimer: 0,
    courier: 0,
    harvester: 4,
    maxharvester: 0,
    recycler: 0,
    refueler: 0,
    remoteminer: 0,
    upgrader: 2
  },
  2: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 0,
    remoteminer: 0,
    upgrader: 2
  },
  3: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 2
  },
  4: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 2
  },
  5: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 4
  },
  6: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 4
  },
  7: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 4
  },
  8: {
    attacker: 0,
    builder: 2,
    claimer: 0,
    courier: 1,
    harvester: 0,
    maxharvester: 2,
    recycler: 0,
    refueler: 1,
    remoteminer: 0,
    upgrader: 1
  }
} as Record<number, Record<string, number>>;
