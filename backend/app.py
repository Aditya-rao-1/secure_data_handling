from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from itsdangerous import Signer, BadSignature
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os
import base64
import secrets
import hmac
import hashlib
import datetime  # if you're using timestamps
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)


# Config
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL')
app.config['MAIL_PASSWORD'] = os.environ.get('PASSWORD')

mail = Mail(app)
db = SQLAlchemy(app)

frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Serve static files from the dist folder under the frontend
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)


# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_encrypted = db.Column(db.Text, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()


# AES Setup
KEY = os.urandom(32)

def encrypt(text):
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(KEY), modes.CBC(iv))
    encryptor = cipher.encryptor()
    padded = text + ' ' * (16 - len(text) % 16)
    ct = encryptor.update(padded.encode()) + encryptor.finalize()
    return base64.b64encode(iv + ct).decode()

def decrypt(enc_text):
    raw = base64.b64decode(enc_text)
    iv, ct = raw[:16], raw[16:]
    cipher = Cipher(algorithms.AES(KEY), modes.CBC(iv))
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(ct) + decryptor.finalize()
    return decrypted.decode().strip()

signer = Signer(app.config['SECRET_KEY'])

# Routes

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"name": u.name_encrypted, "password": u.password_hash} for u in users])

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.json
    name = data['name']
    password = data['password']
    enc_name = encrypt(name)
    hash_pw = bcrypt.generate_password_hash(password).decode()
    db.session.add(User(name_encrypted=enc_name, password_hash=hash_pw))
    db.session.commit()
    users = User.query.all()
    return jsonify({"users": [{"name": u.name_encrypted, "password": u.password_hash} for u in users]})


@app.route('/decrypt', methods=['POST'])
def decrypt_users():
    data = request.json
    password = data.get('globalPassword') or data.get('password')
    users = User.query.all()
    output = []
    for user in users:
        if bcrypt.check_password_hash(user.password_hash, password):
            name = decrypt(user.name_encrypted)
            output.append({"name": name, "password": password})
        else:
            output.append({"name": "Not yours", "password": "Not yours"})
    return jsonify({"users": output})

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    recipient = data.get('email')
    message = data.get('message')

    if not recipient or not message:
        return jsonify({'error': 'Missing email or message'}), 400

    # HMAC Signature
    secret = b'secret_key'  # Shared secret key
    signature = hmac.new(secret, message.encode(), hashlib.sha256).hexdigest()

    # Actually send the email
    try:
        msg = Message(
            subject="Secure Message with Signature",
            sender=app.config['MAIL_USERNAME'],
            recipients=[recipient],
            body=f"Message:\n{message}\n\nSignature:\n{signature}"
        )
        mail.send(msg)

        email_details = {
            'recipient': recipient,
            'message': message,
            'signed': True,
            'time': datetime.datetime.now().isoformat(),
            'signature': signature
        }

        return jsonify({'emailDetails': email_details}), 200

    except Exception as e:
        print("Error sending email:", e)
        return jsonify({'error': 'Failed to send email'}), 500


@app.route('/verify-signature', methods=['POST'])
def verify_signature():
    data = request.json
    message = data['message']
    signature = data['signature']

    secret = b'secret_key'
    expected_sig = hmac.new(secret, message.encode(), hashlib.sha256).hexdigest()

    is_valid = hmac.compare_digest(signature, expected_sig)
    return jsonify({'isValid': is_valid}), 200

if __name__ == '__main__':
    app.run(debug=True)
