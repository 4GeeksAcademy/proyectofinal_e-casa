"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, House, Image, Booking, Favorites
from api.utils import generate_sitemap, APIException
import json
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime
import cloudinary
import cloudinary.uploader

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# endpoint login

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user_query = User.query.filter_by(email=email).first()

    if user_query is None:
        return {"msg": "Este email no existe"}, 404

    if email != user_query.email or password != user_query.password:
        return {"msg": "Email o contraseña incorrectos"}, 404

    access_token = create_access_token(identity=email)

    response_body = {
        "access_token": access_token,
        "user": user_query.serialize()
    }   

    return jsonify(response_body), 200

# validar ruta del token es una ruta protegida

@api.route("/valid_token", methods=["GET"])
@jwt_required()
def validartoken():
    # Accede a la identidad del usuario con get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify({ "is_logged": True }), 200


# endpoint registrarse signup

@api.route('/signup', methods=['POST'])
def crear_registro():
    request_body = request.get_json(force=True)
    

    users = User.query.filter_by(email=request_body["email"]).first()
    if users is not None:
        return jsonify({"msg":"ya existe"}), 404
    
    nuevo_usuario = User(
        name = request.json.get("name", None),
        lastname = request.json.get("lastname", None),
        phone_number = request.json.get("phone_number", None),
        email = request.json.get("email", None),
        password = request.json.get("password", None),
        is_admin = request.json.get("is_admin", None),
        account_creation_date = datetime.now()
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify(nuevo_usuario.serialize()),200

# Obtener el perfil de un usuario

@api.route('/user/<int:usuario_id>', methods=['GET'])
def consulto_un_usuario(usuario_id):

    # Hago una consulta a la tabla usuarios para que traiga un usuario
    usuario_query = User.query.filter_by (id=usuario_id).first ()

    # # Respondo si no existe el  usuario consultado

    if usuario_query is None :
        return jsonify ({"msg":"no existe usuario"}), 404

    response_body = {
        "msg": "Hola, aquí tienes el perfil de este usuario ",
        "results": usuario_query.serialize()
    }
    # # Responde mostrando el usuario consultado

    return jsonify(response_body), 200

# # # Editar datos del perfil de un usuario
@api.route('/user', methods=['PUT'])
@jwt_required()
def editar_perfil():

    request_body = request.get_json(force=True)
    current_user_email = get_jwt_identity()
    perfil_query = User.query.filter_by(email=current_user_email).first()

    if "name" in request_body:
        perfil_query.name = request_body["name"]
    if "lastname" in request_body:
        perfil_query.lastname = request_body["lastname"]
    if "password" in request_body:
        perfil_query.password = request_body["password"]
    if "phone_number" in request_body:
        perfil_query.phone_number = request_body["phone_number"]
    if "is_admin" in request_body:
        perfil_query.is_admin = request_body["is_admin"]

    db.session.commit()
    return jsonify({"msg": "Tu perfil fue editado con éxito"}), 200
    


# Ruta protegida de favoritos

@api.route("/usuario/favorito", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario con get_jwt_identity
    current_user_email = get_jwt_identity()

    user= User.query.filter_by(email=current_user_email).first()
    favoritos=Favorites.query.filter_by(user_id = user.id).all()
    response = list(map(lambda favoritos: favoritos.serialize(), favoritos))
    if response == []:
        return jsonify({"msg": "El usuario no tiene favoritos ingresados"})


    return jsonify({"results": response}), 200

#  Agregar casas a favorito

@api.route('/favoritos/house', methods=['POST'])
def crear_casa_favorita():

    request_body = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman

    # validar que exista el usuario
    user_query = User.query.filter_by(id=request_body["user_id"]).first()
    if user_query is None:
        return jsonify({"msg": "el usuario no está registrado"}), 404

    #validamos que exista una casa
    casa_query = House.query.filter_by(id = request_body["house_id"]).first() #id es la propiedad de la tabla House y house_id es el valor que se pasa por URL
    if casa_query is None:
        return jsonify({"msg": "Esta casa no existe"}), 404

    #validamos que la casa ya existía como fav
    fav_query = Favorites.query.filter_by(user_id = request_body["user_id"]).filter_by(house_id =request_body["house_id"]).first() #devuelve los valores que coinciden (del user_id la tabla Favoritos) con el body del postman
    if fav_query:    #la casa existe para ese usuario no se va a volver a agregar
            return jsonify({"msg": "Esta casa ya existe en favoritos, no se volverá a agregar"}), 400
        
    #Si no se cumplen las condiciones anteriores, se agrega la casa a favoritos

    nueva_casa_favorita=Favorites(user_id= request_body["user_id"], house_id =request_body["house_id"])

    request_body = {
        "msg": "Propiedad agregada a favoritos"
    }


    db.session.add(nueva_casa_favorita)
    db.session.commit()

    return request_body, 200

# //editar posteos ruta protegida

@api.route('/post/<int:house_id>', methods=['PUT'])
@jwt_required()
def editar_posteos(house_id):
        
    request_body = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman
    # Accede a la identidad del usuario con get_jwt_identity
    current_user_email = get_jwt_identity()
   
    post_query = House.query.filter_by(user_id=request_body["user_id"]).filter_by(id=house_id).first()
    
     
    #  validamos que exista una casa
    if post_query is None:
        return jsonify({"msg": "Esta casa no existe"}), 404

    if "title" in request_body:
        post_query.title = request_body["title"]
    if "description" in request_body:
        post_query.description = request_body["description"]
    if "category" in request_body:
        post_query.category = request_body["category"]
    # if "image_id" in body:
    #     casa_query.image_id = body["image_id"]
    if "location" in request_body:
        post_query.location = request_body["location"]
    if "number_of_rooms" in request_body:
        post_query.number_of_rooms = request_body["number_of_rooms"]
    if "number_of_bathrooms" in request_body:
        post_query.number_of_bathrooms = request_body["number_of_bathrooms"]
    if "parking" in request_body:
        post_query.parking = request_body["parking"]
    if "wifi" in request_body:
        post_query.wifi = request_body["wifi"]
    if "price" in request_body:
        post_query.price = request_body["price"]
           
    
    db.session.commit()
    return jsonify({"msg": "Tus cambios ya quedaron"}), 200



# perfil de usuario identificar a qué cuenta me loguee
@api.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    perfil_query = User.query.filter_by(email=current_user).first()
    
    return jsonify(perfil_query.serialize()), 200


    # return jsonify(logged_in_as=current_user), 200


#   Eliminar casa de favorito

@api.route('/favoritos/house/<int:casa_id>', methods=['DELETE'])
def eliminar_casa_favorita(casa_id):

    request_body = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman

# validar que exista el usuario
    user_query = User.query.filter_by(id=request_body["user_id"]).first()
    if user_query is None:
        return jsonify({"msg": "el usuario no está registrado"}), 404

 #validamos que exista la casa
    casa_query = House.query.filter_by(id = casa_id).first() #id es la propiedad de la tabla House y house_id es el valor que se pasa por URL
    if casa_query is None:
        return jsonify({"msg": "La casa no existe"}), 404

#validamos que la casa ya existía como favorita
    fav_query = Favorites.query.filter_by(user_id = request_body["user_id"]).filter_by(house_id =casa_id).first() #devuelve los valores que coinciden (del user_id la tabla Favoritos) con el body del postman
    if fav_query is None:
        return jsonify({"msg": "El favorito no existe"}), 404


    db.session.delete(fav_query)
    db.session.commit()

    request_body = {
        "msg": "Casa eliminada de favoritos"
    }
    
    return jsonify(request_body), 200



@api.route("/post", methods=['POST'])
def save_post():
    image = request.files.get('image')  # Obtén la imagen
    json_data = json.loads(request.form.get('json_data'))  # Obtén la cadena JSON
    print(json_data)

    house = House(
        title=json_data.get("title", None),
        category=json_data.get("category", None),
        image_url="no image",
        description=json_data.get("description", None),
        user_id=json_data.get("user_id", None),
        location=json_data.get("location", None),
        number_of_rooms=json_data.get("number_of_rooms", None),
        number_of_bathrooms=json_data.get("number_of_bathrooms", None),
        parking=json_data.get("parking", None),
        wifi=json_data.get("wifi", None),
        virified_account=json_data.get("virified_account", None),
        price=json_data.get("price", None),
    )

    result = cloudinary.uploader.upload(image)

    house.image_url = result['secure_url']

    db.session.add(house)
    db.session.commit()

    return jsonify(house.serialize()), 200

@api.route("/post/<int:id>", methods=['DELETE'])
def deleteHouse(id):
    house = House.query.filter_by(id = id).first()
    is_removed = False

    if house == None:
        return jsonify({ "msg": "The house dosen´t exist" }), 404

    if house != []:
        db.session.delete(house)
        db.session.commit()
        is_removed = True

    return jsonify({ "is_removed": is_removed }), 200

@api.route("/houses/images/<int:house_id>", methods=['GET'])
def handle_call_house_images(house_id):
    images_query = Image.query.filter_by(house_id = house_id)
    if images_query == []:
        return jsonify({ "msg": "There is not images" })
    
    response = list(map(lambda user: user.serialize(), images_query))

    return jsonify({ "results": response })

@api.route("/gethouses/rent", methods=['GET'])
def getHousesToRent():
    alquiler = House.query.filter_by(category="Alquiler")
    response = list(map(lambda user: user.serialize(), alquiler))
    
    return jsonify({ "results": response }), 200

@api.route("/gethouses/sell", methods=['GET'])
def getHousesToBuy():
    alquiler = House.query.filter_by(category="Venta")
    response = list(map(lambda user: user.serialize(), alquiler))
    
    return jsonify({ "results": response }), 200

@api.route("/gethouse/<int:id>", methods=['GET'])
def getOneSingleHouse(id):
    house = House.query.filter_by(id = id).first()

    if house == None:
        return jsonify({ "msg": "The house dosen´t exist" }), 404

    return jsonify({ "results": house.serialize() }), 200