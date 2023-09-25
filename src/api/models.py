from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    lastname = db.Column(db.String(25), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    profile_picture = db.Column(db.String(300), nullable=True)
    phone_number = db.Column(db.String(30), nullable=False)
    account_creation_date = db.Column(db.String(40), nullable=True)
    premium_level = db.Column(db.Integer, nullable=False)
    is_admin = db.Column(db.Boolean(), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    usuario_favoritos = db.relationship('Favorites', backref='user', lazy=True)
    
    houses = db.relationship('House', backref='user', lazy=True)
    # house_id = db.Column(db.Integer, db.ForeignKey('house.id'))

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "profile_picture": self.profile_picture,
            "email": self.email,
            "password": self.password,
            "phoneNumber": self.phone_number,
            "premium_level": self.premium_level,
            "is_admin": self.is_admin,
            "accountCreationDate": self.account_creation_date,
            "description": self.description,
            "usuario_favoritos": list(map(lambda item: item.serialize(),self.usuario_favoritos))
            # do not serialize the password, its a security breach
        }


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(3000), nullable=False)
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'))

    def __repr__(self):
        return f'<Image {self.id}>'

    def serialize(self):
        house_id = House.query.filter_by(id = self.house_id).first()
        return {
            "id": self.id,
            "url": self.url,
            "house_id": self.house_id
        }


class House(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(300), nullable=False)
    category = db.Column(db.String(10), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    number_of_rooms = db.Column(db.Integer, nullable=False)
    number_of_bathrooms = db.Column(db.Integer, nullable=False)
    parking = db.Column(db.Boolean(), nullable=False)
    wifi = db.Column(db.Boolean(), nullable=False)
    virified_account = db.Column(db.Boolean(), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    images = db.relationship('Image', backref='house', lazy=True)
    

    # user = db.relationship('User', backref='user', lazy=True)
    def __repr__(self):
        return f'<House {self.id}>'

    def serialize(self):
        info_user= User.query.filter_by(id=self.user_id).first()
        return {
            "id": self.id,
            "title": self.title,
            "priority": self.priority,
            "images": list(map(lambda item: item.serialize(),self.images)),
            "description": self.description,
            "category": self.category,
            "info_propietario": {"user_id":info_user.serialize()["id"],"name":info_user.serialize()["name"], "lastname":info_user.serialize()["lastname"], "account_creation_date":info_user.serialize()["accountCreationDate"], "profile_picture":info_user.serialize()["profile_picture"] },#list(map(lambda item: item.serialize(),self.user)),
            "location": self.location,
            "numberOfRooms": self.number_of_rooms,
            "numberOfBathrooms": self.number_of_bathrooms,
            "parking": self.parking,
            "wifi": self.wifi,
            "virified_account": self.virified_account,
            "price": self.price,
            # do not serialize the password, its a security breach
        }


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'))
    date_of_admission = db.Column(db.String(100), nullable=False)
    date_of_delivery = db.Column(db.String(100), nullable=False)

    user = db.relationship("User")
    house = db.relationship("House")

    def __repr__(self):
        return f'<Booking {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "house_id": self.house_id,
            "dateOfAdmission": self.date_of_admission,
            "dateOfDelivery": self.date_of_delivery,
            # do not serialize the password, its a security breach
        }


class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    


    # userId = db.relationship("User")
    houseId = db.relationship("House")


    def __repr__(self):
        return f'<Favorites {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "houseId": None if self.houseId is None else self.houseId.serialize(),

        }