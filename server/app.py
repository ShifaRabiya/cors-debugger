from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

@app.route("/run", methods=["POST"])
def run_code():
    data = request.get_json()
    frontend_code = data.get("frontendCode", "")
    backend_code = data.get("backendCode", "")

    backend_cleaned = "\n".join(
        line for line in backend_code.splitlines()
        if not line.strip().startswith("#")
    )

    fetch_pattern = r'fetch\s*\(\s*[\'"]https?://[^\'"]+[\'"]\s*\)?'
    has_fetch = re.search(fetch_pattern, frontend_code) is not None
    has_flask_cors = "from flask_cors import CORS" in backend_cleaned
    has_cors_app = "CORS(app)" in backend_cleaned

    if not has_fetch:
        return jsonify({"message": "CORS Error: No valid fetch request found!"})
    if has_fetch and has_cors_app and has_flask_cors:
        return jsonify({"message": "CORS configured correctly!"})
    if has_fetch and not has_flask_cors and not has_cors_app:
        return jsonify({"message": "CORS Error: Missing full CORS setup in backend!"}) 
    if has_fetch and not has_flask_cors:
        return jsonify({"message": "CORS Error: Missing CORS import in backend!"})
    if has_fetch and not has_cors_app:
        return jsonify({"message": "CORS Error: Missing CORS(app) in backend!"})

if __name__ == "__main__":
    app.run(debug=True)
