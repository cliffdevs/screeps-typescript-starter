import * as attacker from "./attacker"
import * as builder from "./builder";
import * as claimer from "./claimer";
import * as courier from "./courier";
import * as harvester from "./harvester";
import * as maxharvester from "./maxharvester";
import * as refueler from "./refueler";
import * as remoteminer from "./remoteminer";
import * as upgrader from "./upgrader";

export default {
  attacker: attacker,
  builder: builder,
  claimer: claimer,
  courier: courier,
  harvester: harvester,
  maxharvester: maxharvester,
  refueler: refueler,
  remoteminer: remoteminer,
  upgrader: upgrader
} as Record<string, any>;
