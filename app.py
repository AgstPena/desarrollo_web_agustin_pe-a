import re
from flask import Flask, request, session, redirect, render_template, url_for, jsonify
import db


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")
TEL_RE = re.compile(r"^\+\d{3}\s?\d{4}\s?\d{4}$")


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

app = Flask(__name__)
app.secret_key = "s3cr3t_k3y"

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
    return render_template("Inicio.html")

@app.route("/comunas/<int:region_id>")
def comunas(region_id):
    return jsonify([{"id": c.id, "nombre": c.nombre}
                    for c in db.get_comunas_by_region(region_id)])
    
if __name__ == "__main__":
    app.run(debug=True)