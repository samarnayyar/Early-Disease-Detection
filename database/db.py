import os
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv

load_dotenv()

# Get the MongoDB URI from the environment variables (.env)
import certifi

# Default fallback to a local MongoDB for safety if .env is missing
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/medpredict")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["medpredict"]

# Collections
users_collection = db["users"]
predictions_collection = db["predictions"]

# Ensure unique index on email
users_collection.create_index("email", unique=True)
