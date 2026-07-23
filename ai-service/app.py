import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from detect import analyze_image

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure upload folder or use temp directory
TEMP_DIR = tempfile.gettempdir()

@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided in the request"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save file to a temporary location
        filename = file.filename
        temp_path = os.path.join(TEMP_DIR, filename)
        file.save(temp_path)

        # Classify the image
        result = analyze_image(temp_path, original_filename=filename)

        # Cleanup the temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Add success status
        result["success"] = True
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "Smart Civic AI Detection Service"}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting Smart Civic AI Service on {host}:{port}...")
    app.run(host=host, port=port, debug=True)
