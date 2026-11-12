# Blender 4.0 — builds the portfolio desk scene, renders it, optionally exports GLB.
# usage: blender -b -P desk.py -- --theme light|dark --out file.png [--scale 50] [--samples 96]
#        [--view desktop|mobile] [--glb file.glb] [--blend file.blend]
import bpy, sys, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default=None):
    return argv[argv.index(name) + 1] if name in argv else default
THEME = arg("--theme", "light"); OUT = arg("--out"); SCALE = int(arg("--scale", "100"))
SAMPLES = int(arg("--samples", "96")); VIEW = arg("--view", "desktop"); GLB = arg("--glb"); BLEND = arg("--blend")
DARK = THEME == "dark"
HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "tex")
ASSETS = os.path.join(HERE, "..", "..", "public", "assets")  # profile.jpg, synctask-2.png live here
def tex_path(name):
    p = os.path.join(TEX, name)
    return p if os.path.exists(p) else os.path.join(ASSETS, name)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------- helpers ----------
def srgb(hexstr):
    h = hexstr.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*lin, 1.0)

_mats = {}
def mat(name, color="#ffffff", rough=0.5, metal=0.0, img=None, emit=None, emit_strength=1.0, spec=0.5):
    if name in _mats: return _mats[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value = spec
    if img:
        t = nt.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(tex_path(img))
        nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
        if emit:
            nt.links.new(t.outputs["Color"], b.inputs["Emission Color"])
            b.inputs["Emission Strength"].default_value = emit_strength
    elif emit:
        b.inputs["Emission Color"].default_value = srgb(emit); b.inputs["Emission Strength"].default_value = emit_strength
    _mats[name] = m; return m

def link(o):
    bpy.context.collection.objects.link(o) if o.name not in bpy.context.collection.objects else None
    return o

def finish(o, m, bevel=0.0, smooth=False, segs=3):
    o.data.materials.append(m)
    if bevel:
        mod = o.modifiers.new("bevel", "BEVEL"); mod.width = bevel; mod.segments = segs; mod.limit_method = "ANGLE"
    if smooth:
        for p in o.data.polygons: p.use_smooth = True
    return o

def box(name, size, loc, m, rot=(0, 0, 0), bevel=0.02, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    finish(o, m, bevel)
    if parent: o.parent = parent
    return o

def cyl(name, r, depth, loc, m, rot=(0, 0, 0), verts=48, bevel=0.0, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, vertices=verts, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; finish(o, m, bevel, smooth=True)
    if parent: o.parent = parent
    return o

def rod(name, a, b, r, m):
    a, b = Vector(a), Vector(b); d = b - a
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=24, location=(a + b) / 2)
    o = bpy.context.active_object; o.name = name
    o.rotation_mode = "QUATERNION"; o.rotation_quaternion = d.to_track_quat("Z", "Y")
    return finish(o, m, smooth=True)

def sphere(name, r, loc, m):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=32, ring_count=16)
    o = bpy.context.active_object; o.name = name; return finish(o, m, smooth=True)

def image_plane(name, w, h, loc, m, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; o.scale = (w, h, 1)
    bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m)
    if parent: o.parent = parent
    return o

def cube_uv(o, size):
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cube_project(cube_size=size); bpy.ops.object.mode_set(mode="OBJECT"); o.select_set(False)

def group(name, loc, rz):
    e = bpy.data.objects.new(name, None); e.location = loc; e.rotation_euler = (0, 0, rz); link(e); return e

def place(objs, parent):
    for o in objs: o.parent = parent

# ---------- materials ----------
wood = mat("wood", img="wood.png", rough=0.55)
alu = mat("aluminium", "#c8ccd2", rough=0.32, metal=0.85)
alu_dark = mat("aluminium_dark", "#a9aeb5", rough=0.35, metal=0.8)
keys = mat("keys", "#26282c", rough=0.6)
bezel = mat("bezel", "#0f1012", rough=0.25)
screen = mat("screen", img="synctask-2.png", rough=0.3, emit=True, emit_strength=1.1 if DARK else 0.55)
moss = mat("moss", "#56633f", rough=0.42, spec=0.6)
bulb = mat("bulb", emit="#fff1d2", emit_strength=40)
leather = mat("leather", "#8c491a", rough=0.68)
paper = mat("paper", "#fbf8f1", rough=0.9)
cicd = mat("cicd_page", img="cicd.png", rough=0.9)
notes = mat("notes_page", img="notes.png", rough=0.9)
pencil_m = mat("pencil", "#e5b54a", rough=0.5)
graphite = mat("graphite", "#2b2a27", rough=0.4)
ceramic = mat("ceramic", "#f3eee4", rough=0.28)
coffee = mat("coffee", "#3a2416", rough=0.15)
walnut = mat("walnut", "#3d2c1f", rough=0.45)
photo = mat("photo", img="profile.jpg", rough=0.35, emit=True, emit_strength=0.55 if DARK else 0.12)
matboard = mat("matboard", "#f6f2ea", rough=0.85)
acrylic = mat("acrylic", "#c67139", rough=0.25, spec=0.7)
rubber = mat("rubber", "#1b1b1d", rough=0.85)
tt_yellow = mat("tt_yellow", "#f0c53c", rough=0.5)
pcb_blue = mat("pcb_blue", "#1f5fa8", rough=0.45)
pcb_red = mat("pcb_red", "#b3261e", rough=0.45)
pcb_black = mat("pcb_black", "#1d1f22", rough=0.45)
header = mat("header", "#141416", rough=0.5)
silver = mat("silver", "#d9dde2", rough=0.25, metal=0.9)
cell = mat("cell", "#3c7bd6", rough=0.35)
led_white = mat("led_white", emit="#fff6dd", emit_strength=8)
bb = mat("breadboard", img="breadboard.png", rough=0.7)
bb_side = mat("breadboard_side", "#ece9e1", rough=0.7)
led_red = mat("led_red", "#ff3b2f", rough=0.15, emit="#ff3b2f", emit_strength=6)
wire_red = mat("wire_red", "#d0342c", rough=0.4)
wire_blue = mat("wire_blue", "#2f5fbf", rough=0.4)
resistor_m = mat("resistor", "#d9c49a", rough=0.5)

# ---------- desk ----------
desk = box("Desk", (8.4, 5.2, 0.32), (0, 0, -0.16), wood, bevel=0.06)
cube_uv(desk, 8.4)

# ---------- laptop showing Synctask ----------
lap = group("Laptop", (0.45, 0.35, 0), 0.45)
place([
    box("Laptop_base", (3.0, 2.05, 0.1), (0, 0, 0.05), alu, bevel=0.035),
    box("Laptop_keys", (2.62, 0.95, 0.012), (0, 0.2, 0.106), keys, bevel=0.0),
    box("Laptop_pad", (1.05, 0.62, 0.006), (0, -0.62, 0.103), alu_dark, bevel=0.0),
], lap)
hinge = bpy.data.objects.new("Laptop_hinge", None); hinge.location = (0, 1.02, 0.1); hinge.rotation_euler = (math.radians(-12), 0, 0); link(hinge); hinge.parent = lap
place([
    box("Laptop_lid", (3.0, 0.07, 1.95), (0, 0.0, 0.975), alu, bevel=0.03),
    box("Laptop_bezel", (2.9, 0.012, 1.85), (0, -0.04, 0.975), bezel, bevel=0.0),
    image_plane("Laptop_screen", 2.72, 1.5, (0, -0.048, 1.0), screen, rot=(math.radians(90), 0, 0)),
], hinge)

# ---------- desk lamp (moss), lighting the desk ----------
B = Vector((-3.05, 1.65, 0)); J = Vector((-2.62, 1.38, 2.25)); Hd = Vector((-1.45, 0.78, 2.55))
target = Vector((0.2, -0.35, 0))
cyl("Lamp_base", 0.48, 0.13, (B.x, B.y, 0.065), moss, bevel=0.03)
rod("Lamp_arm_low", B + Vector((0, 0, 0.1)), J, 0.055, moss)
sphere("Lamp_joint", 0.11, J, moss)
rod("Lamp_arm_high", J, Hd, 0.05, moss)
sphere("Lamp_joint_head", 0.08, Hd, moss)
shade_c = Hd + Vector((0.18, -0.12, -0.18))
bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.5, radius2=0.12, depth=0.62, end_fill_type="NOTHING", location=shade_c)
shade = bpy.context.active_object; shade.name = "Lamp_shade"
shade.rotation_mode = "QUATERNION"; shade.rotation_quaternion = (target - shade_c).normalized().to_track_quat("-Z", "Y")
sol = shade.modifiers.new("thick", "SOLIDIFY"); sol.thickness = 0.025
finish(shade, moss, smooth=True)
bulb_pos = shade_c + (target - shade_c).normalized() * 0.18
sphere("Lamp_bulb", 0.12, bulb_pos, bulb)

# ---------- notebook with the CI/CD pipeline ----------
nb = group("Notebook", (-2.3, -1.15, 0), 0.2)
place([
    box("Notebook_cover", (3.1, 2.1, 0.05), (0, 0, 0.025), leather, bevel=0.015),
    box("Notebook_page_L", (1.48, 1.98, 0.05), (-0.76, 0, 0.075), paper, bevel=0.008),
    box("Notebook_page_R", (1.48, 1.98, 0.05), (0.76, 0, 0.075), paper, bevel=0.008),
    image_plane("Notebook_cicd", 1.36, 0.85, (-0.76, 0.1, 0.1015), cicd),
    image_plane("Notebook_notes", 1.36, 1.82, (0.76, 0, 0.1015), notes),
], nb)
pen = group("Pencil", (-0.6, -1.75, 0.04), -0.35)
place([cyl("Pencil_body", 0.04, 1.3, (0, 0, 0), pencil_m, rot=(0, math.radians(90), 0), verts=6)], pen)
bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.04, radius2=0.0, depth=0.14, location=(0.72, 0, 0), rotation=(0, math.radians(90), 0))
tip = bpy.context.active_object; tip.name = "Pencil_tip"; finish(tip, graphite); tip.parent = pen

# ---------- breadboard with a lit LED (AR-DUINO's Blinking LED) ----------
bbg = group("Breadboard", (0.85, -1.95, 0), 0.32)
place([
    box("Breadboard_body", (1.7, 0.56, 0.1), (0, 0, 0.05), bb_side, bevel=0.012),
    image_plane("Breadboard_top", 1.68, 0.54, (0, 0, 0.1012), bb),
    cyl("LED_dome", 0.06, 0.12, (0.2, 0.06, 0.24), led_red, verts=24),
    sphere("LED_tip", 0.06, (0.2, 0.06, 0.3), led_red),
    cyl("LED_leg_a", 0.008, 0.14, (0.18, 0.06, 0.13), silver, verts=8),
    cyl("LED_leg_b", 0.008, 0.14, (0.22, 0.06, 0.13), silver, verts=8),
    cyl("Resistor", 0.03, 0.22, (-0.15, -0.04, 0.16), resistor_m, rot=(0, math.radians(90), 0), verts=16),
], bbg)

# ---------- IoT RC car: Arduino Uno + NodeMCU + L298N ----------
car = group("RC_car", (3.05, -1.45, 0), -0.55)
parts = [box("Car_plate", (1.15, 1.85, 0.05), (0, 0, 0.43), acrylic, bevel=0.012)]
for sx in (-1, 1):
    for sy in (-1, 1):
        parts.append(cyl(f"Car_tire_{sx}{sy}", 0.3, 0.22, (sx * 0.74, sy * 0.62, 0.3), rubber, rot=(0, math.radians(90), 0), bevel=0.04))
        parts.append(cyl(f"Car_hub_{sx}{sy}", 0.15, 0.235, (sx * 0.74, sy * 0.62, 0.3), tt_yellow, rot=(0, math.radians(90), 0)))
        parts.append(box(f"Car_motor_{sx}{sy}", (0.34, 0.22, 0.18), (sx * 0.42, sy * 0.62, 0.3), tt_yellow, bevel=0.01))
parts += [
    box("Uno_pcb", (0.7, 0.54, 0.03), (0, -0.42, 0.47), pcb_blue, bevel=0.004),
    box("Uno_usb", (0.17, 0.2, 0.12), (-0.2, -0.72, 0.54), silver, bevel=0.008),
    box("Uno_jack", (0.12, 0.18, 0.12), (0.18, -0.72, 0.54), header, bevel=0.01),
    box("Uno_chip", (0.1, 0.36, 0.04), (0.1, -0.32, 0.505), header, bevel=0.004),
    box("Uno_header_a", (0.04, 0.46, 0.08), (-0.31, -0.4, 0.525), header, bevel=0.0),
    box("Uno_header_b", (0.04, 0.46, 0.08), (0.31, -0.4, 0.525), header, bevel=0.0),
    box("L298N_pcb", (0.44, 0.44, 0.03), (0.22, 0.32, 0.47), pcb_red, bevel=0.004),
    box("NodeMCU_pcb", (0.22, 0.5, 0.03), (-0.36, 0.28, 0.47), pcb_black, bevel=0.004),
    box("NodeMCU_chip", (0.14, 0.18, 0.03), (-0.36, 0.38, 0.5), silver, bevel=0.003),
    box("Battery_holder", (0.6, 0.32, 0.12), (0, 0.76, 0.52), header, bevel=0.01),
    cyl("Cell_a", 0.065, 0.56, (0, 0.69, 0.6), cell, rot=(0, math.radians(90), 0), verts=24),
    cyl("Cell_b", 0.065, 0.56, (0, 0.83, 0.6), cell, rot=(0, math.radians(90), 0), verts=24),
    sphere("Headlight_L", 0.045, (-0.3, -0.93, 0.44), led_white),
    sphere("Headlight_R", 0.045, (0.3, -0.93, 0.44), led_white),
]
for i in range(7):
    parts.append(box(f"L298N_fin_{i}", (0.03, 0.26, 0.2), (0.12 + i * 0.035, 0.32, 0.585), header, bevel=0.0))
place(parts, car)

# ---------- mug ----------
mug = group("Mug", (-1.85, 0.55, 0), 0.0)
place([
    cyl("Mug_body", 0.3, 0.66, (0, 0, 0.33), ceramic, bevel=0.02),
    cyl("Mug_band", 0.305, 0.14, (0, 0, 0.46), moss),
    cyl("Mug_coffee", 0.27, 0.02, (0, 0, 0.6), coffee),
], mug)
bpy.ops.mesh.primitive_torus_add(major_radius=0.16, minor_radius=0.04, location=(0.32, 0, 0.35), rotation=(math.radians(90), 0, 0))
h = bpy.context.active_object; h.name = "Mug_handle"; finish(h, ceramic, smooth=True); h.parent = mug

# ---------- framed portrait, facing the camera ----------
CAM = Vector((8.6, -12.6, 8.4)) if VIEW == "desktop" else Vector((7.4, -12.4, 10.2))
fpos = Vector((2.75, 1.45, 0))
face = math.atan2(CAM.x - fpos.x, -(CAM.y - fpos.y))
frame = group("Frame", fpos, face)
tilt = (math.radians(-10), 0, 0)
place([
    box("Frame_wood", (1.4, 0.1, 1.7), (0, 0, 0.86), walnut, rot=tilt, bevel=0.02),
    box("Frame_mat", (1.22, 0.02, 1.52), (0, -0.05, 0.868), matboard, rot=tilt, bevel=0.0),
    image_plane("Frame_photo", 1.02, 1.02, (0, -0.064, 0.95), photo, rot=(math.radians(80), 0, 0)),
    box("Frame_stand", (0.12, 0.6, 0.05), (0, 0.32, 0.4), walnut, rot=(math.radians(55), 0, 0), bevel=0.0),
], frame)

# ---------- lights ----------
spot_d = bpy.data.lights.new("LampLight", "SPOT"); spot_d.energy = 1700 if DARK else 1000
spot_d.color = (1.0, 0.82, 0.58); spot_d.spot_size = math.radians(88); spot_d.spot_blend = 0.55; spot_d.shadow_soft_size = 0.14
spot = bpy.data.objects.new("LampLight", spot_d); link(spot); spot.location = bulb_pos
spot.rotation_mode = "QUATERNION"; spot.rotation_quaternion = (target - bulb_pos).normalized().to_track_quat("-Z", "Y")
glow_d = bpy.data.lights.new("LampGlow", "POINT"); glow_d.energy = 60 if DARK else 25; glow_d.color = (1, 0.8, 0.55); glow_d.shadow_soft_size = 0.2
glow = bpy.data.objects.new("LampGlow", glow_d); link(glow); glow.location = shade_c
fill_d = bpy.data.lights.new("Fill", "AREA"); fill_d.size = 16; fill_d.energy = 60 if DARK else 800
fill_d.color = (0.62, 0.7, 0.95) if DARK else (1, 0.98, 0.95)
fill = bpy.data.objects.new("Fill", fill_d); link(fill); fill.location = (9, -7, 10)
fill.rotation_mode = "QUATERNION"; fill.rotation_quaternion = (Vector((0, 0, 0)) - fill.location).normalized().to_track_quat("-Z", "Y")

pk_d = bpy.data.lights.new("PortraitKey", "AREA"); pk_d.size = 1.4; pk_d.energy = 55 if DARK else 30; pk_d.color = (1, 0.9, 0.78)
pk = bpy.data.objects.new("PortraitKey", pk_d); link(pk); pk.location = fpos + Vector((1.4, -2.2, 2.0))
pk.rotation_mode = "QUATERNION"; pk.rotation_quaternion = (fpos + Vector((0, 0, 0.9)) - pk.location).normalized().to_track_quat("-Z", "Y")
world = bpy.data.worlds.new("World"); scene.world = world; world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = srgb("#2a2420") if DARK else srgb("#f4efe6"); bg.inputs["Strength"].default_value = 0.1 if DARK else 0.38

# soft contact shadow under the floating desk


# ---------- camera ----------
cam_d = bpy.data.cameras.new("Cam"); cam_d.sensor_fit = "VERTICAL"; cam_d.sensor_height = 24
cam = bpy.data.objects.new("Cam", cam_d); link(cam); cam.location = CAM; scene.camera = cam
aim = bpy.data.objects.new("Aim", None); link(aim)
if VIEW == "desktop":
    aim.location = (0.35, -0.05, 0.4); cam_d.lens = 47; cam_d.shift_x = -0.315; cam_d.shift_y = 0.03; cam_d.shift_y = 0.0
    scene.render.resolution_x, scene.render.resolution_y = 2160, 1350
else:
    aim.location = (0.4, -0.1, 0.5); cam_d.lens = 39; cam_d.shift_y = 0.0
    scene.render.resolution_x, scene.render.resolution_y = 780, 900
tc = cam.constraints.new("TRACK_TO"); tc.target = aim; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"

# ---------- render ----------
scene.render.engine = "CYCLES"; scene.cycles.device = "CPU"; scene.cycles.samples = SAMPLES
scene.cycles.use_adaptive_sampling = True
scene.cycles.sample_clamp_indirect = 1.5; scene.cycles.sample_clamp_direct = 6; scene.cycles.blur_glossy = 1.0
try:
    scene.cycles.use_denoising = True; scene.cycles.denoiser = "OPENIMAGEDENOISE"
except Exception as e:
    print("DENOISE unavailable:", e); scene.cycles.use_denoising = False
scene.render.film_transparent = True
scene.render.resolution_percentage = SCALE
scene.view_settings.view_transform = "AgX"; scene.view_settings.look = "AgX - Medium High Contrast"
scene.render.image_settings.file_format = "PNG"; scene.render.image_settings.color_mode = "RGBA"

if BLEND: bpy.ops.wm.save_as_mainfile(filepath=BLEND)
if OUT:
    scene.render.filepath = OUT; bpy.ops.render.render(write_still=True)
if GLB:
    for o in scene.objects: o.select_set(o.type in {"MESH", "EMPTY"} and o.name != "ShadowCatcher")
    bpy.ops.export_scene.gltf(filepath=GLB, export_format="GLB", use_selection=True, export_apply=True, export_lights=False, export_cameras=False)
print("DONE")
