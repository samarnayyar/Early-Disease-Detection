import os
from functools import wraps
from flask import request, jsonify
import jwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-default-key-please-change-in-env")

def token_required(f):
    """
    Middleware decorator to protect routes with JWT Authentication.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in the Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Authentication Token is missing!"}), 401

        try:
            # Decode the token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # Inject the user_id from the token into the kwargs of the route
            current_user_id = data.get("user_id")
            if not current_user_id:
                raise ValueError("Invalid token structure")
                
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired! Please log in again."}), 401
        except Exception as e:
            return jsonify({"error": "Invalid Authentication Token!"}), 401

        return f(current_user_id, *args, **kwargs)

    return decorated
