import re
import os
from flask import Flask, request, session, redirect, render_template, url_for, jsonify, flash
import db
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime
from functools import wraps


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")
TEL_RE = re.compile(r"^\+\d{3}\s?\d{4}\s?\d{4}$")

#valid resultados form voluntario
def validate_registro(username, email, telefono, comuna):
    if len(username) < 3:
        return "El nombre debe tener al menos 3 caracteres."
    if not EMAIL_RE.match(email):
        return "El correo no es válido."
    if not TEL_RE.match(telefono):
        return "El teléfono no es válido."
    if comuna is None or db.get_comuna_by_id(comuna) is None:
        return "Debes elegir una comuna válida."
    return ""

#validar formato de la imagen
def es_imagen_valida(f):
    head = f.read(12)
    f.seek(0)
    return (head.startswith(b"\xff\xd8\xff")                      # JPEG
            or head.startswith(b"\x89PNG\r\n\x1a\n")              # PNG
            or head.startswith((b"GIF87a", b"GIF89a"))            # GIF
            or (head[:4] == b"RIFF" and head[8:12] == b"WEBP"))   # WEBP
#info util
EXT_PERMITIDAS = {"jpg", "jpeg", "png", "gif", "webp"}
MAX_ARCHIVOS = 5
MAX_BYTES = 5 * 1024 * 1024 
#validar resultados form avistamiento
def validate_avistamiento(ave_id, lugar, fecha, hora, archivos):
    if ave_id is None or db.get_ave_by_id(ave_id) is None:
        return "Debes elegir un ave de la lista."
    if not lugar or len(lugar) > 200:
        return "La zona del avistamiento es obligatoria (máx. 200 caracteres)."
    try:
        fecha_hora = datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")
    except ValueError:
        return "Debes indicar una fecha y una hora válidas."
    if fecha_hora > datetime.now():
        return "La fecha y hora no pueden estar en el futuro."
    if not archivos:
        return "Debes subir al menos una imagen."
    if len(archivos) > MAX_ARCHIVOS:
        return f"Puedes subir como máximo {MAX_ARCHIVOS} imágenes."
    for f in archivos:
        ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
        if ext not in EXT_PERMITIDAS or not es_imagen_valida(f):
            return f"«{f.filename}» no es una imagen válida (JPG, PNG, GIF o WEBP)."
        f.seek(0, os.SEEK_END)
        tam = f.tell()
        f.seek(0)
        if tam > MAX_BYTES:
            return f"«{f.filename}» pesa más de 5 MB."
    return ""

#exigir sesion activa
def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        if user_id is None or db.get_voluntario_by_id(user_id) is None:
            session.clear()
            if request.method == "POST":
                return jsonify(ok=False,
                               error="Primero debes registrarte para enviar un avistamiento."), 401
            flash("Primero debes registrarte para registrar un avistamiento.")
            return redirect(url_for("register"))
        return f(*args, **kwargs)
    return wrapper

app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"
app.config["MAX_CONTENT_LENGTH"] = 26 * 1024 * 1024

UPLOAD_DIR = os.path.join(app.static_folder, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route("/Registro", methods=["GET", "POST"])
def register():
    error=""
    if request.method == 'POST':
        nombre = request.form.get("full_name", "")
        email = request.form.get("email").strip()
        telefono = request.form.get("telefono").strip()
        comuna = request.form.get("comuna_id", type=int)
        
        error = validate_registro(nombre, email, telefono, comuna)
        if not error:
            status, result = db.register_voluntario(nombre, email, telefono, comuna)
            if status: 
                
                session["user_id"] = result
                return redirect(url_for("index")) 
            error += result
        
    return render_template("Registro.html", error = error, regiones=db.get_regiones())
    

@app.route("/")
def index():
    return render_template("Inicio.html", avistamientos=db.get_ultimos_avistamientos(2))

@app.route("/comunas/<int:region_id>")
def comunas(region_id):
    return jsonify([{"id": c.id, "nombre": c.nombre}
                    for c in db.get_comunas_by_region(region_id)])


@app.route("/VistaAves", methods=["GET", "POST"])
@login_required
def vista_aves():
    if request.method == "GET":
        return render_template("VistaAves.html", aves=db.get_aves())

    ave_id = request.form.get("ave_id", type=int)
    lugar = request.form.get("lugar", "").strip()
    fecha = request.form.get("fecha-avist", "")
    hora = request.form.get("hora-avist", "")
    archivos = [f for f in request.files.getlist("imagen-avist") if f.filename]

    error = validate_avistamiento(ave_id, lugar, fecha, hora, archivos)
    if error:
        return jsonify(ok=False, error=error), 400

    fecha_hora = datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")
    guardados = []  
    try:
        for f in archivos:
            ext = f.filename.rsplit(".", 1)[-1].lower()
            nombre_unico = f"{uuid.uuid4().hex}.{ext}" #uuid = universal unique identifier 
            f.save(os.path.join(UPLOAD_DIR, nombre_unico))
            original = secure_filename(f.filename)[:300] or nombre_unico
            guardados.append((f"uploads/{nombre_unico}", original))

        db.create_avistamiento(session["user_id"], ave_id, fecha_hora,
                       lugar, None, guardados)
    except Exception:
        app.logger.exception("Error al guardar el avistamiento")
        for ruta, _ in guardados:          
            try:
                os.remove(os.path.join(app.static_folder, ruta))
            except OSError:
                pass
        return jsonify(ok=False, error="No se pudo guardar el avistamiento. Intenta de nuevo."), 500

    return jsonify(ok=True)


@app.errorhandler(413)
def demasiado_grande(e):
    return jsonify(ok=False, error="Las imágenes son demasiado pesadas (máx. 5 MB cada una)."), 413

if __name__ == "__main__":
    app.run(debug=True)