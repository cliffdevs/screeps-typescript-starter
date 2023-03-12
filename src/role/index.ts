import * as attacker from "./attacker"
import * as builder from "./builder"
import * as claimer from "./claimer"
import * as courier from "./courier"
import * as harvester from "./harvester"
import * as maxharvester from "./maxharvester"
import * as recycler from "./recycler"
import * as refueler from "./refueler"
import * as remoteharvester from "./remoteharvester"
import * as remoteminer from "./remoteminer"
import * as upgrader from "./upgrader"

interface RoleFunction {
  run: (creep: Creep) => void;
}

export default {
  attacker: attacker,
  builder: builder,
  claimer: claimer,
  courier: courier,
  harvester: harvester,
  maxharvester: maxharvester,
  recycler: recycler,
  refueler: refueler,
  remoteharvester: remoteharvester,
  remoteminer: remoteminer,
  upgrader: upgrader
} as Record<string, RoleFunction>;
