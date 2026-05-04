import datetime
import os
import jwt
from flask import Blueprint, request, jsonify
from database.db import users_collection

auth_bp = Blueprint('auth', __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-default-key-please-change-in-env")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required!"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "User with this email already exists!"}), 409

        result = users_collection.insert_one({"name": name, "email": email, "password": password})
        user_id = str(result.inserted_id)

        token = jwt.encode(
            {"user_id": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
            JWT_SECRET, algorithm="HS256"
        )

        return jsonify({"message": "User registered successfully!", "token": token, "user": {"id": user_id, "name": name, "email": email}}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required!"}), 400

        user = users_collection.find_one({"email": email})

        if not user or user['password'] != password:
            return jsonify({"error": "Invalid email or password!"}), 401

        token = jwt.encode(
            {"user_id": str(user["_id"]), "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
            JWT_SECRET, algorithm="HS256"
        )

        return jsonify({"message": "Login successful!", "token": token, "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
