from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/run", methods=["POST"])
def run_code():

    data = request.get_json()
    print("Received from frontend:", data)

    frontend_code = data.get("frontendCode", "")
    backend_code = data.get("backendCode", "")

    print("Frontend Code:", frontend_code)
    print("Backend Code:", backend_code)

    has_fetch = "fetch(" in frontend_code
    has_flask_cors = "from flask_cors import CORS" in backend_code
    has_cors_app = "CORS(app)" in backend_code

    if not has_fetch:
        return jsonify({"message": "CORS Error: No fetch request found in frontend!"})
    if has_fetch and has_cors_app and has_flask_cors:
        return jsonify({"message": "CORS configured correctly!"})
    if has_fetch and not has_flask_cors and not has_cors_app
        return jsonify({"message": "CORS Error: Missing full CORS setup in backend!"}) 
    if has_fetch and not has_flask_cors:
        return jsonify({"message": "CORS Error: Missing CORS import in backend!"})
    if has_fetch and not has_cors_app:
        return jsonify({"message": "CORS Error: Missing CORS(app) in backend!"})
           

if __name__ == "__main__":
    app.run(debug=True)