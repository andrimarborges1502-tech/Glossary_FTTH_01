import os
import re
import shutil

BASE = os.path.dirname(os.path.abspath(__file__))
HTML_FILE = os.path.join(BASE, "index.html")
CSS_FILE  = os.path.join(BASE, "styles.css")
JS_FILE   = os.path.join(BASE, "script.js")
IMG_DIR   = os.path.join(BASE, "assets", "img")

# 1. Leer HTML original
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# 2. Extraer y guardar CSS
css_match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
if css_match:
    with open(CSS_FILE, "w", encoding="utf-8") as f:
        f.write(css_match.group(1).strip())
    print("✓ styles.css creado")

# 3. Extraer y guardar JS
js_match = re.search(r"<script>(.*?)</script>", html, re.DOTALL)
if js_match:
    with open(JS_FILE, "w", encoding="utf-8") as f:
        f.write(js_match.group(1).strip())
    print("✓ script.js creado")

# 4. Crear carpeta assets/img
os.makedirs(IMG_DIR, exist_ok=True)
print("✓ assets/img/ creada")

# 5. Mover imágenes locales
IMG_EXTS = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp")
moved = []
for fname in os.listdir(BASE):
    if fname.lower().endswith(IMG_EXTS):
        shutil.move(os.path.join(BASE, fname), os.path.join(IMG_DIR, fname))
        moved.append(fname)
print(f"✓ {len(moved)} imágenes movidas a assets/img/")

# 6. Actualizar HTML: reemplazar bloques style y script
html = re.sub(r"<style>.*?</style>",
              '<link rel="stylesheet" href="styles.css">',
              html, flags=re.DOTALL)

html = re.sub(r"<script>.*?</script>",
              '<script src="script.js"></script>',
              html, flags=re.DOTALL)

# 7. Actualizar rutas de imágenes (solo las locales, no las http)
def fix_img(m):
    src = m.group(1)
    if src.startswith("http"):
        return m.group(0)  # no tocar URLs externas
    return f'src="assets/img/{src}"'

html = re.sub(r'src="([^"]+\.(png|jpg|jpeg|gif|svg|webp))"', fix_img, html)

# 8. Guardar index.html actualizado
with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)
print("✓ index.html actualizado")
print("\n¡Listo! Estructura final:")
print("  index.html")
print("  styles.css")
print("  script.js")
print("  assets/img/  (todas las imágenes)")