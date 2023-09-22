"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import json
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, House, Image, Booking, Favorites
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import datetime
import cloudinary
import cloudinary.uploader
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
bcrypt = Bcrypt()

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#//endpoint login

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user_query = User.query.filter_by(email=email).first()

    isTheRightPassword = bcrypt.check_password_hash(user_query.password, password)

    if user_query is None:
        return {"msg": "Este email no existe"}, 404

    if email != user_query.email or isTheRightPassword == False:
        return {"msg": "Email o contraseña incorrectos"}, 404

    access_token = create_access_token(identity=email)

    response_body = {
        "access_token": access_token,
        "user": user_query.serialize()
    }   

    return jsonify(response_body), 200

#//validar ruta del token es una ruta protegida

@api.route("/valid_token", methods=["GET"])
@jwt_required()
def validartoken():
    # Accede a la identidad del usuario con get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify({ "is_logged": True }), 200


#//endpoint registrarse signup

@api.route('/signup', methods=['POST'])
def crear_registro():
    request_body = request.get_json(force=True)
    

    users = User.query.filter_by(email=request_body["email"]).first()
    if users is not None:
        return jsonify({ "msg": "ya existe" }), 404
    
    hashed_password = bcrypt.generate_password_hash(request.json.get("password", None)).decode('utf-8')

    nuevo_usuario = User(
        name = request.json.get("name", None),
        lastname = request.json.get("lastname", None),
        phone_number = request.json.get("phone_number", None),
        email = request.json.get("email", None),
        password = hashed_password,
        is_admin = request.json.get("is_admin", None),
        profile_picture = "",
        account_creation_date = datetime.now(),
        description = None
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify(nuevo_usuario.serialize()),200

#//Obtener el perfil del usuario logeado
@api.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user_info():
    current_user_email = get_jwt_identity()

    user = User.query.filter_by(email = current_user_email).first()

    return jsonify({ "results": user.serialize() })

#//Obtener el perfil de un usuario en particular

@api.route('/user/<int:usuario_id>', methods=['GET'])
def consulto_un_usuario(usuario_id):

    # Hago una consulta a la tabla usuarios para que traiga un usuario
    usuario_query = User.query.filter_by (id=usuario_id).first ()

    # # Respondo si no existe el usuario consultado

    if usuario_query is None :
        return jsonify ({"msg":"no existe usuario"}), 404

    response_body = {
        "msg": "Hola, aquí tienes el perfil de este usuario ",
        "results": usuario_query.serialize()
    }
    # # Responde mostrando el usuario consultado

    return jsonify(response_body), 200

#//Editar datos del perfil de un usuario
@api.route('/user', methods=['PUT'])
@jwt_required()
def editar_perfil():

    request_body = request.get_json(force=True)
    current_user_email = get_jwt_identity()
    perfil_query = User.query.filter_by(email=current_user_email).first()
    hashed_password = bcrypt.generate_password_hash(request.json.get("password", None)).decode('utf-8')

    if "name" in request_body:
        perfil_query.name = request_body["name"]
    if "lastname" in request_body:
        perfil_query.lastname = request_body["lastname"]
    if "password" in request_body:
        perfil_query.password = hashed_password
    if "phone_number" in request_body:
        perfil_query.phone_number = request_body["phone_number"]
    if "is_admin" in request_body:
        perfil_query.is_admin = request_body["is_admin"]
    if "description" in request_body:
        perfil_query.description = request_body["description"]

    db.session.commit()
    return jsonify({"msg": "Tu perfil fue editado con éxito"}), 200

#//Eliminar cuenta de usuario

@api.route('/user', methods=['DELETE'])
@jwt_required()
def eliminar_perfil():

    current_user_email = get_jwt_identity()
    perfil_query = User.query.filter_by(email=current_user_email).first()

    if perfil_query is not None:

        db.session.delete(perfil_query)
        db.session.commit()
        return jsonify({"msg": "Tu perfil fue eliminado con éxito"}), 200
    
    return jsonify({"msg": "No se encontró tu perfil"}), 404
    

@api.route("/profile_picture", methods=["POST"])
@jwt_required()
def set_user_image():
    picture_url  = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman
    current_user_email = get_jwt_identity()

    user = User.query.filter_by(email = current_user_email).first()

    user.profile_picture = picture_url
    
    db.session.commit()

    return jsonify({ "msg": "La imagen fue añadida con exito"}), 200


#//Ruta protegida de favoritos

@api.route("/usuario/favorito", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario con get_jwt_identity
    current_user_email = get_jwt_identity()

    user= User.query.filter_by(email=current_user_email).first()
    favoritos=Favorites.query.filter_by(user_id = user.id).all()
    response = list(map(lambda favoritos: favoritos.serialize(), favoritos))
    if response == []:
        return jsonify({"msg": "No tienes favoritos ingresados"}), 404


    return jsonify({"results": response}), 200

#//Obtener todas las casas de un usuario en especifico

@api.route("/user/houses/<int:owner_id>", methods=["GET"])
def owner_properties(owner_id):
    user = User.query.filter_by(id = owner_id).first()

    if user is None:
        return jsonify({ "msg": "El usuario no existe" }), 404

    houses = House.query.filter_by(user_id = owner_id).all()
    
    response = list(map(lambda favoritos: favoritos.serialize(), houses))
    if response == [] or response is None:
        return jsonify({ "msg": "El usuario no tiene casas" }), 404

    return jsonify({ "results": response }), 200

#//Obtener todas las casas del usuario logueado

@api.route("/user/houses", methods=["GET"])
@jwt_required()
def get_current_user_houses():
    current_user_email = get_jwt_identity()

    user = User.query.filter_by(email = current_user_email).first()

    houses = House.query.filter_by(user_id = user.id).all()

    response = list(map(lambda favoritos: favoritos.serialize(), houses))
    if response == [] or response is None:
        return jsonify({ "msg": "El usuario no tiene casas" }), 404

    return jsonify({ "results": response })

#// Agregar casas a favorito

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

#//editar posteos ruta protegida

@api.route('/post/<int:house_id>', methods=['PUT'])
@jwt_required()
def editar_posteos(house_id):
    json_data = json.loads(request.form.get('json_data'))

    #request_body = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman
    # Accede a la identidad del usuario con get_jwt_identity
    current_user_email = get_jwt_identity()

    user = User.query.filter_by(email = current_user_email).first()
   
    post_query = House.query.filter_by(user_id=user.id, id=house_id).first()
    print(post_query)
     
    #  validamos que exista una casa
    if post_query is None:
        return jsonify({"msg": "Esta casa no existe"}), 404

    if "title" in json_data:
        post_query.title = json_data["title"]
    if "description" in json_data:
        post_query.description = json_data["description"]
    if "category" in json_data:
        post_query.category = json_data["category"]
    # if "image_id" in body:
    #     casa_query.image_id = body["image_id"]
    if "location" in json_data:
        post_query.location = json_data["location"]
    if "number_of_rooms" in json_data:
        post_query.number_of_rooms = json_data["number_of_rooms"]
    if "number_of_bathrooms" in json_data:
        post_query.number_of_bathrooms = json_data["number_of_bathrooms"]
    if "parking" in json_data:
        post_query.parking = json_data["parking"]
    if "wifi" in json_data:
        post_query.wifi = json_data["wifi"]
    if "price" in json_data:
        post_query.price = json_data["price"]
           
    
    db.session.commit()
    return jsonify({"msg": "Tus cambios ya quedaron"}), 200



#//perfil de usuario identificar a qué cuenta me loguee
@api.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()

    perfil_query = User.query.filter_by(email=current_user).first()
    
    return jsonify(perfil_query.serialize()), 200



#// Eliminar casa de favorito

@api.route('/favoritos/house/<int:casa_id>', methods=['DELETE'])
@jwt_required()
def eliminar_casa_favorita(casa_id):
    # Accede a la identidad del usuario con get_jwt_identity
    current_user = get_jwt_identity()


    # request_body = request.get_json(force=True) #obtiene el cuerpo que se envíe por el body desde el postman

    # validar que exista el usuario
    user_query = User.query.filter_by(email=current_user).first()
    if user_query is None:
        return jsonify({"msg": "el usuario no está registrado"}), 404

    #validamos que exista la casa
    casa_query = House.query.filter_by(id = casa_id).first() #id es la propiedad de la tabla House y house_id es el valor que se pasa por URL
    if casa_query is None:
        return jsonify({"msg": "La casa no existe"}), 404

    #validamos que la casa ya existía como favorita
    fav_query = Favorites.query.filter_by(user_id = user_query.serialize()["id"]).filter_by(house_id =casa_id).first() #devuelve los valores que coinciden (del user_id la tabla Favoritos) con el body del postman
    if fav_query is None:
        return jsonify({"msg": "El favorito no existe"}), 404


    db.session.delete(fav_query)
    db.session.commit()

    request_body = {
        "msg": "Casa eliminada de favoritos"
    }
    
    return jsonify(request_body), 200




#//Agrega casas a un usuario propietario

@api.route("/post", methods=['POST'])
@jwt_required()
def save_post():
    json_data = json.loads(request.form.get('json_data'))  # Obtén la cadena JSON

    if len(json_data['imagesUrl']) <= 4:
        return jsonify({ "msg": "Debes añadir almenos 5 imagenes" })

    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email = current_user_email).first()

    error_index_dosent_exist = f"El usuario con id {json_data.get('user_id', None)},  no existe" 
    error_index_not_received = "El user_id no fue enviado" 

    user_id = user.id

    if user_id is None:
        return jsonify({ "msg": error_index_not_received })

    user = User.query.filter_by(id = user_id).first()

    if user is None:
        return jsonify({ "msg": error_index_dosent_exist })

    house = House(
        title=json_data.get("title", None),
        category=json_data.get("category", None),
        description=json_data.get("description", None),
        user_id=user_id,
        location=json_data.get("location", None),
        number_of_rooms=json_data.get("number_of_rooms", None),
        number_of_bathrooms=json_data.get("number_of_bathrooms", None),
        parking=json_data.get("parking", None),
        wifi=json_data.get("wifi", None),
        virified_account=json_data.get("virified_account", None),
        price=json_data.get("price", None),
    )
    
    user.is_admin = True

    db.session.add(house)
    db.session.commit()

    for image in json_data['imagesUrl']:
        image = Image(url = image, house_id = house.id)
        db.session.add(image)
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

@api.route("/gethouses", methods=['GET'])
def getAllTheHouses():
    houses = House.query.all()
    response = list(map(lambda user: user.serialize(), houses))

    if response == None:
        return jsonify({ "msg": "The house dosen´t exist" }), 404

    return jsonify({ "results": response }), 200

@api.route("/gethouse/<int:id>", methods=['GET'])
def getOneSingleHouse(id):
    house = House.query.filter_by(id = id).first()

    if house == None:
        return jsonify({ "msg": "The house dosen´t exist" }), 404

    return jsonify({ "results": house.serialize() }), 200
 