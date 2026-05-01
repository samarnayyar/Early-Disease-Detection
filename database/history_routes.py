import json
from flask import Blueprint, jsonify
from database.db import predictions_collection
from database.auth_middleware import token_required

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    try:
        # Fetch all predictions for the logged-in user, sorted by newest first
        history_cursor = predictions_collection.find(
            {"user_id": current_user_id}
        ).sort("created_at", -1).limit(20)
        
        history = []
        for doc in history_cursor:
            history.append({
                "id": str(doc["_id"]),
                "disease": doc["disease"],
                "risk_score": doc["risk_score"],
                "status": doc.get("status", "Unknown"),
                "created_at": doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else doc["created_at"],
                # We can also return input_data if they want to view their raw inputs
                "input_data": doc.get("input_data", {})
            })

        return jsonify({"history": history}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
