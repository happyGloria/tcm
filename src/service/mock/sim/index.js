import Entry from './1_entry.js'
import Device from './device'
import Node from './2_node.js'
import Role from './3_role.js'
import User from './4_user.js'
import Sys from './5_sys.js'
import GB from './6_gb.js'
import Plan from './Plan.js'
import Wall from './wall.js'
import Zone from './zone.js'
import Drive from './drive.js'

export default Object.assign(
  {},
  Entry,
  Node,
  Device,
  Plan,
  Role,
  Sys,
  User,
  Wall,
  Zone,
  Drive,
  GB
)
