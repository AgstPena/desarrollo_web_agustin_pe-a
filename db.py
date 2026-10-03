import pymysql
from sqlalchemy import (
    create_engine, Column, Integer, String, DateTime, Text, ForeignKey
)
from datetime import datetime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_CHARSET = "utf8"

DATABASE_URL = (
    f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?charset={DB_CHARSET}"
)
engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False, index=True)

    region = relationship("Region", back_populates="comunas")
    voluntarios = relationship("Voluntario", back_populates="comuna")

class Voluntario(Base):
    __tablename__ = "voluntario"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False, index=True)

    comuna = relationship("Comuna", back_populates="voluntarios")
    avistamientos = relationship("Avistamiento", back_populates="voluntario")
class Ave(Base):
    __tablename__ = "ave"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)

    avistamientos = relationship("Avistamiento", back_populates="ave")

class Avistamiento(Base):
    __tablename__ = "avistamiento"
    id = Column(Integer, primary_key=True, autoincrement=True)
    voluntario_id = Column(Integer, ForeignKey("voluntario.id"), nullable=False, index=True)
    ave_id = Column(Integer, ForeignKey("ave.id"), nullable=False, index=True)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)

    voluntario = relationship("Voluntario", back_populates="avistamientos")
    ave = relationship("Ave", back_populates="avistamientos")
    registros = relationship("Registro", back_populates="avistamiento")

class Registro(Base):
    __tablename__ = "registro"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False, index=True)

    avistamiento = relationship("Avistamiento", back_populates="registros")
    
#Funciones de mi db
#Buscar
def get_comunas_by_region(id_region):
    with SessionLocal() as session:
        user = session.query(Comuna).filter_by(region_id=id_region).all()
        session.close()
        return user
def get_regiones():
    with SessionLocal() as session:
        user=session.query(Region).all()
        session.close()
        return user
def get_comuna_by_id(comuna_id):
    with SessionLocal() as session:
        user=session.get(Comuna, comuna_id)
        session.close()
        return user
def get_voluntario_by_id(id):
    with SessionLocal() as session:
        user = session.query(Voluntario).filter_by(id=id).first()
        session.close()
        return user
def get_voluntario_by_email(email):
    with SessionLocal() as session:
        user = session.query(Voluntario).filter_by(email=email).first()
        session.close()
        return user
def get_voluntario_by_nombre(nombre):
    with SessionLocal() as session:
        user = session.query(Voluntario).filter_by(nombre=nombre).first()
        session.close()
        return user
def get_registro_by_avistamiento(id):
    with SessionLocal() as session:
        user = session.query(Registro).filter_by(avistamiento_id=id).all()
        session.close()
        return user

#Crear
def create_voluntario(nombre, email, telefono, comuna_id):
    with SessionLocal() as session:
        new_voluntario=Voluntario(
            nombre=nombre,
            email=email,
            telefono=telefono,
            comuna_id = comuna_id,
            fecha_registro=datetime.now()
        )
        session.add(new_voluntario)
        session.flush()
        nuevo_id=new_voluntario.id
        session.commit()
        return nuevo_id


def create_avistamiento(vol_id,ave_id,fecha_hora,lugar, descripcion):
    with SessionLocal() as session:
        new_avistamiento = Avistamiento(
            voluntario_id=vol_id,
            ave_id=ave_id,
            fecha_hora=fecha_hora,
            lugar=lugar,
            descripcion=descripcion
        )
        session.add(new_avistamiento)
        session.commit()
        session.close()
        
def register_voluntario(nombre, email, telefono, comuna):
    if get_voluntario_by_email(email) is not None:
        return False, "El correo ya esta en uso."
    nuevo_id = create_voluntario(nombre,email, telefono, comuna)
    return True, nuevo_id