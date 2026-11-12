# Blender 5.x — polishes renders/desk.blend in place: detailed laptop, lamp, mug, pencil,
# and an RC car rebuilt from the real parts list. Group names (Laptop, Notebook, RC_car, Frame,
# Breadboard, Mug, Pencil) are kept because the website uses them.
# Run inside Blender (MCP or Text Editor) with desk.blend open:  exec(open(r"<path>/polish.py").read())
import bpy, bmesh, math, os
from mathutils import Vector, Matrix

HERE = os.path.join(os.path.dirname(bpy.data.filepath), "..")  # desk.blend lives in renders/
ROOT = os.path.join(HERE, "..", "..")
scene = bpy.context.scene
coll = scene.collection

# ---------- fix texture paths (the .blend pointed at renders/tex/, which does not exist) ----------
for img in bpy.data.images:
    for d in (os.path.join(HERE, "tex"), os.path.join(ROOT, "public", "assets")):
        p = os.path.normpath(os.path.join(d, img.name))
        if os.path.exists(p):
            img.filepath = p; img.reload(); break

# ---------- helpers ----------
def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return (*[x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c], 1.0)

def mat(name, color="#ffffff", rough=0.5, metal=0.0, emit=None, es=1.0, spec=0.5, coat=0.0):
    m = bpy.data.materials.get(name)
    if m: return m
    m = bpy.data.materials.new(name)
    try: m.use_nodes = True
    except Exception: pass
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = spec
    if coat: b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = srgb(emit); b.inputs["Emission Strength"].default_value = es
    return m

def new_obj(name, me, m, parent, smooth=False):
    o = bpy.data.objects.new(name, me); coll.objects.link(o)
    if m: me.materials.append(m)
    if smooth:
        for p in me.polygons: p.use_smooth = True
    o.parent = parent
    return o

def bevel(o, w, segs=3):
    mod = o.modifiers.new("bevel", "BEVEL"); mod.width = w; mod.segments = segs; mod.limit_method = "ANGLE"
    return o

def boxes(name, items, m, parent, bev=0.0, segs=2):
    """items: list of (size, loc) or (size, loc, rot_z). One mesh, many boxes."""
    bm = bmesh.new()
    for it in items:
        size, loc = it[0], it[1]; rz = it[2] if len(it) > 2 else 0
        mtx = Matrix.Translation(loc) @ Matrix.Rotation(rz, 4, "Z") @ Matrix.Diagonal((*size, 1))
        bmesh.ops.create_cube(bm, size=1, matrix=mtx)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = new_obj(name, me, m, parent)
    return bevel(o, bev, segs) if bev else o

def box(name, size, loc, m, parent, bev=0.0, segs=2):
    return boxes(name, [(size, loc)], m, parent, bev, segs)

AX = {"x": Matrix.Rotation(math.pi / 2, 4, "Y"), "y": Matrix.Rotation(math.pi / 2, 4, "X"), "z": Matrix.Identity(4)}
def cyl(name, r, depth, loc, m, parent, axis="z", verts=40, bev=0.0, caps=True, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=caps, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=depth,
                          matrix=Matrix.Translation(loc) @ AX[axis])
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = new_obj(name, me, m, parent, smooth=True)
    return bevel(o, bev, 3) if bev else o

def rod(name, a, b, r, m, parent, verts=20):
    a, b = Vector(a), Vector(b); d = b - a
    q = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r, depth=d.length,
                          matrix=Matrix.Translation((a + b) / 2) @ q)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    return new_obj(name, me, m, parent, smooth=True)

def lathe(name, prof, m, parent, loc=(0, 0, 0), segs=64):
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in prof]
    es = [bm.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=segs, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.transform(Matrix.Translation(loc))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    return new_obj(name, me, m, parent, smooth=True)

def wire(name, pts, m, parent, r=0.011):
    """Bezier jumper wire through pts, converted to a mesh so it exports to glTF."""
    cu = bpy.data.curves.new(name + "_c", "CURVE"); cu.dimensions = "3D"
    cu.bevel_depth = r; cu.bevel_resolution = 2; cu.resolution_u = 10; cu.use_fill_caps = True
    sp = cu.splines.new("BEZIER"); sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p; bp.handle_left_type = bp.handle_right_type = "AUTO"
    tmp = bpy.data.objects.new(name + "_tmp", cu); coll.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp); bpy.data.curves.remove(cu)
    me.materials.clear()
    return new_obj(name, me, m, parent, smooth=True)

def clear_children(g):
    for c in list(g.children_recursive):
        bpy.data.objects.remove(c, do_unlink=True)

G = bpy.data.objects

# ---------- materials ----------
alu = mat("aluminium"); alu_dark = mat("aluminium_dark"); keys_m = mat("keys"); bezel_m = mat("bezel")
screen = mat("screen"); moss = mat("moss"); bulb = mat("bulb"); ceramic = mat("ceramic"); coffee = mat("coffee")
graphite = mat("graphite"); pencil_m = mat("pencil"); acrylic = mat("acrylic"); rubber = mat("rubber")
tt_yellow = mat("tt_yellow"); pcb_blue = mat("pcb_blue"); pcb_red = mat("pcb_red"); pcb_black = mat("pcb_black")
header = mat("header"); silver = mat("silver"); cell = mat("cell")
well = mat("key_well", "#1a1b1e", rough=0.5)
hinge_m = mat("hinge", "#3a3d42", rough=0.35, metal=0.6)
lens = mat("cam_lens", "#050506", rough=0.1)
shade_in = mat("shade_inner", "#f4ead6", rough=0.6, emit="#fff1d2", es=0.6)
moss_dark = mat("moss_dark", "#3f4a2e", rough=0.4)
steel = mat("steel", "#9aa0a8", rough=0.3, metal=0.9)
wood_raw = mat("pencil_wood", "#e2c29a", rough=0.7)
eraser = mat("eraser", "#e58f86", rough=0.8)
brass = mat("brass", "#c9a45a", rough=0.3, metal=0.9)
motor_can = mat("motor_can", "#c9ced4", rough=0.3, metal=0.9)
tt_shaft = mat("tt_shaft", "#f2f0ea", rough=0.5)
term_blue = mat("terminal_blue", "#2d6fd6", rough=0.45)
cap_black = mat("cap_black", "#16171a", rough=0.3)
esp_shield = mat("esp_shield", "#cfd3d8", rough=0.25, metal=0.85)
holder_m = mat("holder_black", "#151517", rough=0.6)
W = {c: mat(f"wire_{c}", h, rough=0.45) for c, h in
     [("red", "#d0342c"), ("black", "#1f1f22"), ("yellow", "#e6c22e"), ("green", "#2f9a4a"),
      ("blue", "#2f5fbf"), ("orange", "#e57a2b"), ("white", "#ece9e2"), ("purple", "#7a4bb3")]}

# ======================= LAPTOP =======================
lap = G["Laptop"]; clear_children(lap)
box("Laptop_base", (3.0, 2.05, 0.08), (0, 0, 0.04), alu, lap, bev=0.035, segs=4)
box("Laptop_well", (2.72, 1.02, 0.002), (0, 0.22, 0.0805), well, lap)
kp, ks = 0.187, 0.155
x0 = -13 * kp / 2
key_items = [((ks, 0.07, 0.014), (x0 + i * kp, 0.655, 0.088)) for i in range(14)]
for row, y in enumerate((0.53, 0.355, 0.18, 0.005)):
    key_items += [((ks, 0.15, 0.014), (x0 + i * kp, y, 0.088)) for i in range(14)]
yb = -0.17
key_items += [((ks, 0.15, 0.014), (x0 + i * kp, yb, 0.088)) for i in list(range(4)) + list(range(10, 14))]
key_items.append(((6 * kp - 0.032, 0.15, 0.014), (x0 + 6.5 * kp, yb, 0.088)))
boxes("Laptop_keys", key_items, keys_m, lap, bev=0.012, segs=2)
box("Laptop_pad", (1.15, 0.66, 0.003), (0, -0.62, 0.0812), alu_dark, lap)
box("Laptop_notch", (0.4, 0.04, 0.03), (0, -1.02, 0.07), alu_dark, lap, bev=0.008)
cyl("Laptop_barrel", 0.042, 2.5, (0, 1.0, 0.075), hinge_m, lap, axis="x")
hinge = bpy.data.objects.new("Laptop_hinge", None); coll.objects.link(hinge); hinge.parent = lap
hinge.location = (0, 1.0, 0.08); hinge.rotation_euler = (math.radians(-12), 0, 0)
box("Laptop_lid", (3.0, 0.05, 1.95), (0, 0, 0.975), alu, hinge, bev=0.03, segs=4)
box("Laptop_bezel", (2.94, 0.004, 1.89), (0, -0.026, 0.975), bezel_m, hinge)
bpy.ops.mesh.primitive_plane_add(size=1)
scr = bpy.context.active_object; scr.name = "Laptop_screen"
scr.data.transform(Matrix.Diagonal((2.72, 1.5, 1, 1)))
scr.data.materials.append(screen); scr.parent = hinge
scr.location = (0, -0.0285, 1.0); scr.rotation_euler = (math.radians(90), 0, 0)
cyl("Laptop_camera", 0.014, 0.004, (0, -0.0285, 1.86), lens, hinge, axis="y", verts=16)

# ======================= LAMP (grouped so the web can switch it) =======================
for o in [o for o in scene.objects if o.type == "MESH" and o.name.startswith("Lamp_")]:
    bpy.data.objects.remove(o, do_unlink=True)
lamp = G.get("Lamp") or bpy.data.objects.new("Lamp", None)
if lamp.name not in coll.objects: coll.objects.link(lamp)
B = Vector((-3.05, 1.65, 0)); J = Vector((-2.62, 1.38, 2.25)); Hd = Vector((-1.45, 0.78, 2.55))
target = Vector((0.2, -0.35, 0))
cyl("Lamp_base", 0.48, 0.09, (B.x, B.y, 0.045), moss, lamp, verts=64, bev=0.035)
cyl("Lamp_base_top", 0.2, 0.06, (B.x, B.y, 0.12), moss_dark, lamp, verts=48, bev=0.02)
cyl("Lamp_switch", 0.05, 0.04, (B.x + 0.28, B.y - 0.22, 0.1), moss_dark, lamp, verts=24, bev=0.01)
side = (J - B).cross(Vector((0, 0, 1))).normalized() * 0.05
P0 = B + Vector((0, 0, 0.15))
for s, tag in ((1, "a"), (-1, "b")):
    rod(f"Lamp_arm_low_{tag}", P0 + side * s, J + side * s, 0.024, moss, lamp)
    rod(f"Lamp_arm_high_{tag}", J + side * s, Hd + side * s, 0.021, moss, lamp)
for p, nm in ((P0, "Lamp_knuckle_base"), (J, "Lamp_knuckle"), (Hd, "Lamp_knuckle_head")):
    rod(nm, p - side * 1.7, p + side * 1.7, 0.055, moss_dark, lamp, verts=24)
    rod(nm + "_bolt", p - side * 1.9, p + side * 1.9, 0.02, steel, lamp, verts=12)
# tension spring alongside the lower arm
sp_a, sp_b = B.lerp(J, 0.18) + Vector((0, 0, 0.1)), B.lerp(J, 0.7)
spring_pts = []
axis_v = (sp_b - sp_a); u = axis_v.cross(Vector((0, 0, 1))).normalized(); v = axis_v.normalized().cross(u)
off = -v * 0.11
for i in range(0, 361):
    t = i / 360; a = t * 2 * math.pi * 26
    spring_pts.append(sp_a.lerp(sp_b, t) + off + (u * math.cos(a) + v * math.sin(a)) * 0.022)
cu = bpy.data.curves.new("spring_c", "CURVE"); cu.dimensions = "3D"; cu.bevel_depth = 0.005; cu.bevel_resolution = 1
spl = cu.splines.new("POLY"); spl.points.add(len(spring_pts) - 1)
for pt, p in zip(spl.points, spring_pts): pt.co = (*p, 1)
tmp = bpy.data.objects.new("spring_tmp", cu); coll.objects.link(tmp)
me = bpy.data.meshes.new_from_object(tmp.evaluated_get(bpy.context.evaluated_depsgraph_get()))
bpy.data.objects.remove(tmp); bpy.data.curves.remove(cu); me.materials.clear()
new_obj("Lamp_spring", me, steel, lamp, smooth=True)
rod("Lamp_spring_hook_a", sp_a + off, sp_a, 0.006, steel, lamp)
rod("Lamp_spring_hook_b", sp_b + off, sp_b, 0.006, steel, lamp)
# shade: open cone (outer moss, inner warm paper), rolled rim, cap at the neck
shade_c = Hd + Vector((0.18, -0.12, -0.18))
rot = (target - shade_c).normalized().to_track_quat("-Z", "Y").to_matrix().to_4x4()
def shade_part(name, r1, r2, depth, m, z=0.0, caps=False, verts=64):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=caps, segments=verts, radius1=r1, radius2=r2, depth=depth,
                          matrix=Matrix.Translation(shade_c) @ rot @ Matrix.Translation((0, 0, z)))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    return new_obj(name, me, m, lamp, smooth=True)
o = shade_part("Lamp_shade", 0.5, 0.12, 0.62, moss)
sol = o.modifiers.new("thick", "SOLIDIFY"); sol.thickness = 0.012
shade_part("Lamp_shade_inner", 0.485, 0.112, 0.6, shade_in, z=-0.005)
shade_part("Lamp_shade_cap", 0.135, 0.135, 0.08, moss_dark, z=0.33, caps=True, verts=48)
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=False, segments=64, radius1=0.505, radius2=0.505, depth=0.025,
                      matrix=Matrix.Translation(shade_c) @ rot @ Matrix.Translation((0, 0, -0.305)))
me = bpy.data.meshes.new("Lamp_rim"); bm.to_mesh(me); bm.free()
rim = new_obj("Lamp_rim", me, moss_dark, lamp, smooth=True); rim.modifiers.new("t", "SOLIDIFY").thickness = 0.02
rod("Lamp_neck", Hd, shade_c + (rot @ Vector((0, 0, 0.37))), 0.03, moss_dark, lamp)
bulb_pos = shade_c + (target - shade_c).normalized() * 0.18
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=bulb_pos, segments=32, ring_count=16)
bo = bpy.context.active_object; bo.name = "Lamp_bulb"; bo.data.materials.append(bulb); bo.parent = lamp
for p in bo.data.polygons: p.use_smooth = True
cyl("Lamp_socket", 0.07, 0.14, (0, 0, 0), moss_dark, lamp)
G["Lamp_socket"].matrix_world = Matrix.Translation(shade_c + (rot @ Vector((0, 0, 0.12)))) @ rot

# ======================= MUG =======================
mug = G["Mug"]; clear_children(mug)
lathe("Mug_body", [(0, 0), (0.27, 0), (0.29, 0.006), (0.3, 0.03), (0.3, 0.64), (0.298, 0.66), (0.29, 0.67),
                   (0.28, 0.668), (0.274, 0.655), (0.272, 0.63), (0.272, 0.08), (0.26, 0.062), (0, 0.06)], ceramic, mug)
cyl("Mug_band", 0.303, 0.13, (0, 0, 0.46), moss, mug, verts=64, caps=False)
cyl("Mug_coffee", 0.271, 0.004, (0, 0, 0.56), coffee, mug, verts=64)
bpy.ops.mesh.primitive_torus_add(major_radius=0.15, minor_radius=0.035, major_segments=48, minor_segments=16)
h = bpy.context.active_object; h.name = "Mug_handle"
h.data.transform(Matrix.Rotation(math.pi / 2, 4, "X") @ Matrix.Diagonal((1, 1.3, 1, 1)))
h.data.materials.append(ceramic); h.parent = mug; h.location = (0.33, 0, 0.36)
for p in h.data.polygons: p.use_smooth = True

# ======================= PENCIL =======================
pen = G["Pencil"]; clear_children(pen)
cyl("Pencil_body", 0.04, 1.1, (-0.05, 0, 0), pencil_m, pen, axis="x", verts=6)
cyl("Pencil_wood", 0.04, 0.14, (0.57, 0, 0), wood_raw, pen, axis="x", verts=6, r2=0.012)
cyl("Pencil_tip", 0.012, 0.04, (0.66, 0, 0), graphite, pen, axis="x", verts=12, r2=0.001)
cyl("Pencil_ferrule", 0.042, 0.08, (-0.64, 0, 0), brass, pen, axis="x", verts=24)
cyl("Pencil_eraser", 0.039, 0.08, (-0.72, 0, 0), eraser, pen, axis="x", verts=24, bev=0.01)

# ======================= RC CAR (real parts only) =======================
# 4WD acrylic chassis, Arduino Uno, NodeMCU, L298N, 4x yellow TT gear motors with wheels,
# 2x18650 holder, jumper wires. Local frame: x = width, y = length, front = -y. 1 unit = 10 cm.
car = G["RC_car"]; clear_children(car)
car.location = (2.9, -1.2, 0); car.rotation_euler = (0, 0, -0.7); car.scale = (0.85, 0.85, 0.85)
PT = 0.47  # top of the acrylic plate
box("Car_plate", (1.3, 2.2, 0.03), (0, 0, PT - 0.015), acrylic, car, bev=0.01)
# 4WD: one TT gear motor per wheel under the plate, axle out the side, motor can pointing inward.
for sy, end in ((1, "R"), (-1, "F")):  # rear, front
    for sx, side in ((-1, "L"), (1, "R")):
        tag = end + side; ay = sy * 0.76
        box(f"TT_gearbox_{tag}", (0.22, 0.52, 0.3), (sx * 0.5, sy * 0.6, 0.29), tt_yellow, car, bev=0.02)
        cyl(f"TT_can_{tag}", 0.095, 0.24, (sx * 0.5, sy * 0.22, 0.29), motor_can, car, axis="y", bev=0.01)
        box(f"TT_can_cap_{tag}", (0.12, 0.03, 0.1), (sx * 0.5, sy * 0.085, 0.29), tt_yellow, car)
        box(f"TT_strap_{tag}", (0.05, 0.12, 0.04), (sx * 0.5, sy * 0.6, PT - 0.05), header, car)
        cyl(f"TT_shaft_{tag}", 0.03, 0.2, (sx * 0.68, ay, 0.33), tt_shaft, car, axis="x", verts=16)
        wx = sx * 0.8
        cyl(f"Wheel_tire_{tag}", 0.33, 0.26, (wx, ay, 0.33), rubber, car, axis="x", verts=64, bev=0.05)
        bm = bmesh.new()
        for i in range(28):
            a = i / 28 * 2 * math.pi
            bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Translation((wx, ay + math.cos(a) * 0.33, 0.33 + math.sin(a) * 0.33))
                                  @ Matrix.Rotation(-a, 4, "X") @ Matrix.Diagonal((0.2, 0.045, 0.03, 1)))
        me = bpy.data.meshes.new(f"Wheel_tread_{tag}"); bm.to_mesh(me); bm.free()
        new_obj(f"Wheel_tread_{tag}", me, rubber, car)
        cyl(f"Wheel_rim_{tag}", 0.2, 0.275, (wx, ay, 0.33), tt_yellow, car, axis="x", verts=48)
        cyl(f"Wheel_hub_{tag}", 0.065, 0.3, (wx, ay, 0.33), tt_yellow, car, axis="x", verts=24)
        for k in range(6):
            a = k / 6 * 2 * math.pi
            cyl(f"Wheel_hole_{tag}{k}", 0.042, 0.004, (wx + sx * 0.138, ay + math.cos(a) * 0.13, 0.33 + math.sin(a) * 0.13),
                header, car, axis="x", verts=16)

# --- Arduino Uno (68.6 x 53.4 mm), USB/jack edge toward the front-left ---
U = Vector((0, -0.58, PT))
def u(x, y, z): return U + Vector((x, y, z))
box("Uno_pcb", (0.69, 0.53, 0.016), u(0, 0, 0.008), pcb_blue, car, bev=0.004)
box("Uno_usb", (0.16, 0.12, 0.11), u(-0.3, 0.12, 0.071), silver, car, bev=0.006)
box("Uno_jack", (0.14, 0.09, 0.11), u(-0.31, -0.17, 0.071), header, car, bev=0.01)
box("Uno_chip", (0.35, 0.075, 0.035), u(0.1, -0.08, 0.034), header, car, bev=0.003)
box("Uno_chip_socket", (0.37, 0.095, 0.012), u(0.1, -0.08, 0.022), header, car)
boxes("Uno_headers", [((0.26, 0.026, 0.085), u(-0.02, 0.235, 0.058)), ((0.2, 0.026, 0.085), u(0.24, 0.235, 0.058)),
                      ((0.2, 0.026, 0.085), u(0.0, -0.235, 0.058)), ((0.155, 0.026, 0.085), u(0.22, -0.235, 0.058))],
      header, car)
boxes("Uno_parts", [((0.05, 0.05, 0.025), u(-0.27, 0.215, 0.028)), ((0.05, 0.075, 0.06), u(0.31, -0.04, 0.046)),
                    ((0.06, 0.06, 0.012), u(-0.16, 0.12, 0.022)), ((0.045, 0.018, 0.02), u(-0.04, 0.03, 0.026))],
      header, car)
cyl("Uno_cap_a", 0.022, 0.06, u(-0.2, -0.04, 0.046), cap_black, car, verts=16)
cyl("Uno_cap_b", 0.022, 0.06, u(-0.15, -0.04, 0.046), cap_black, car, verts=16)
# --- 2 x 18650 holder in the middle ---
BH = Vector((0, -0.02, PT))
boxes("Battery_holder", [((0.8, 0.44, 0.02), BH + Vector((0, 0, 0.01))),
                         ((0.8, 0.02, 0.1), BH + Vector((0, 0.21, 0.05))), ((0.8, 0.02, 0.1), BH + Vector((0, -0.21, 0.05))),
                         ((0.03, 0.44, 0.12), BH + Vector((0.385, 0, 0.06))), ((0.03, 0.44, 0.12), BH + Vector((-0.385, 0, 0.06))),
                         ((0.76, 0.02, 0.06), BH + Vector((0, 0, 0.03)))], holder_m, car, bev=0.004)
for k, y in enumerate((0.1, -0.1)):
    cyl(f"Cell_{'ab'[k]}", 0.088, 0.66, BH + Vector((-0.01, y, 0.11)), cell, car, axis="x", verts=32, bev=0.012)
    cyl(f"Cell_{'ab'[k]}_tip", 0.035, 0.02, BH + Vector((0.33, y, 0.11)), silver, car, axis="x", verts=16)
    cyl(f"Cell_{'ab'[k]}_spring", 0.05, 0.03, BH + Vector((-0.355, y, 0.11)), silver, car, axis="x", verts=16)
# --- L298N (43 x 43 mm), rear right ---
L = Vector((0.3, 0.52, PT))
def l(x, y, z): return L + Vector((x, y, z))
box("L298N_pcb", (0.43, 0.43, 0.016), l(0, 0, 0.008), pcb_red, car, bev=0.004)
boxes("L298N_heatsink", [((0.2, 0.24, 0.03), l(0, 0.03, 0.031))] +
      [((0.02, 0.24, 0.2), l(-0.09 + i * 0.03, 0.03, 0.14)) for i in range(7)], header, car)
boxes("L298N_terminals", [((0.075, 0.1, 0.08), l(-0.17, 0.06, 0.056)), ((0.075, 0.1, 0.08), l(0.17, 0.06, 0.056)),
                          ((0.15, 0.075, 0.08), l(-0.08, -0.17, 0.056))], term_blue, car, bev=0.004)
cyl("L298N_cap_a", 0.03, 0.1, l(0.14, -0.13, 0.066), cap_black, car, verts=20)
cyl("L298N_cap_b", 0.03, 0.1, l(-0.15, -0.08, 0.066), cap_black, car, verts=20)
box("L298N_pins", (0.15, 0.025, 0.025), l(0.1, -0.19, 0.028), header, car)
box("L298N_reg", (0.05, 0.03, 0.06), l(0.05, -0.12, 0.046), header, car)
# --- NodeMCU (49 x 26 mm) on its pin headers, rear left ---
N = Vector((-0.36, 0.56, PT))
def n(x, y, z): return N + Vector((x, y, z))
boxes("NodeMCU_headers", [((0.025, 0.4, 0.08), n(-0.11, 0, 0.04)), ((0.025, 0.4, 0.08), n(0.11, 0, 0.04))], header, car)
box("NodeMCU_pcb", (0.26, 0.49, 0.016), n(0, 0, 0.088), pcb_black, car, bev=0.004)
box("NodeMCU_chip", (0.16, 0.17, 0.025), n(0, 0.1, 0.108), esp_shield, car, bev=0.003)
box("NodeMCU_antenna", (0.16, 0.06, 0.006), n(0, 0.21, 0.099), pcb_blue, car)
box("NodeMCU_usb", (0.08, 0.06, 0.03), n(0, -0.225, 0.111), silver, car, bev=0.004)
boxes("NodeMCU_parts", [((0.035, 0.035, 0.02), n(-0.08, -0.19, 0.106)), ((0.035, 0.035, 0.02), n(0.08, -0.19, 0.106)),
                        ((0.06, 0.06, 0.012), n(0, -0.1, 0.102))], header, car)

# --- jumper wires (Dupont housings at the header ends) ---
housings = []
def jumper(name, a, b, color, lift=0.18, r=0.011, mid=None, ends=(True, True)):
    a, b = Vector(a), Vector(b)
    a_top, b_top = a + Vector((0, 0, 0.06)), b + Vector((0, 0, 0.06))
    pts = [a_top, a_top + Vector((0, 0, lift * 0.5))]
    if mid is not None: pts.append(Vector(mid))
    else: pts.append((a_top + b_top) / 2 + Vector((0, 0, lift)))
    pts += [b_top + Vector((0, 0, lift * 0.5)), b_top]
    wire(name, pts, W[color], car, r)
    for p, e in zip((a, b), ends):
        if e: housings.append(((0.028, 0.028, 0.065), p + Vector((0, 0, 0.03))))
# Uno D-pins -> L298N IN1..IN4
for k, c in enumerate(("orange", "yellow", "green", "blue")):
    jumper(f"Wire_in{k + 1}", u(0.17 + k * 0.025, 0.235, 0.1), l(0.05 + k * 0.025, -0.19, 0.04), c, lift=0.22 + k * 0.03)
# NodeMCU <-> Uno serial
jumper("Wire_tx", n(-0.11, -0.14, 0.12), u(0.27, 0.235, 0.1), "white", lift=0.3)
jumper("Wire_rx", n(-0.11, -0.11, 0.12), u(0.3, 0.235, 0.1), "purple", lift=0.34)
# L298N 5V/GND -> Uno power header
jumper("Wire_5v", l(-0.11, -0.17, 0.09), u(0.0, -0.235, 0.1), "red", lift=0.28, ends=(False, True))
jumper("Wire_gnd", l(-0.05, -0.17, 0.09), u(0.03, -0.235, 0.1), "black", lift=0.25, ends=(False, True))
# battery leads -> L298N power terminal
wire("Wire_batt_red", [BH + Vector((0.38, 0.12, 0.13)), BH + Vector((0.45, 0.25, 0.2)), l(-0.11, -0.17, 0.14)], W["red"], car, 0.014)
wire("Wire_batt_black", [BH + Vector((-0.38, -0.12, 0.13)), BH + Vector((-0.2, 0.3, 0.28)), l(-0.05, -0.17, 0.14)], W["black"], car, 0.014)
# L298N motor outputs -> TT motor tabs, routed past the plate edge. 4WD: each output drives
# the two motors on its side in parallel (front pair wired from the rear pair's tabs).
for sx, side, tx in ((1, "R", 0.17), (-1, "L", -0.17)):
    for k, c in enumerate(("red", "black")):
        dy = (k - 0.5) * 0.04
        start = l(tx, 0.06 + dy, 0.1)
        edge = Vector((sx * 0.7, 0.2 + dy, PT + 0.04))
        rear_tab = Vector((sx * 0.5 + dy, 0.07, 0.36))
        front_tab = Vector((sx * 0.5 + dy, -0.07, 0.36))
        wire(f"Wire_motor_R{side}_{c}", [start, start + Vector((0, -0.05, 0.12)), edge, rear_tab], W[c], car, 0.012)
        wire(f"Wire_motor_F{side}_{c}", [rear_tab, Vector((sx * 0.5 + dy, 0, 0.4)), front_tab], W[c], car, 0.012)
boxes("Wire_housings", housings, header, car)

# ---------- portrait light: keep the photo clearly lit ----------
if "PortraitKey" in G: G["PortraitKey"].data.energy = max(G["PortraitKey"].data.energy, 40)

result = {"car_children": len(car.children), "laptop_children": len(lap.children_recursive), "lamp": len(lamp.children)}
