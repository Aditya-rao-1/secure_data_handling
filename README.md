# 🔐 Secure Data Handling

A full-stack web application for securely storing, encrypting, emailing, and verifying user data using cryptographic best practices.

🌐 **Live App**: [**https://secure-data-handling.onrender.com/**](https://secure-data-handling.onrender.com/)

---

# 🎥 **Project Demo Video**

📺 **Watch Demo**: [**Click to Watch Demo Video**](https://drive.google.com/file/d/1bT8dvBOcjCB_tGKq5LG88vDitVp0lSef/view?usp=drive_link)

---

## 🚀 Features

- 🔒 **Secure Data Storage** – Encrypt user names using AES and store passwords as Bcrypt hashes.
- 🧩 **Global Decryption** – Decrypt stored users using a global password (if matches any hash).
- 📧 **Secure Email Transmission** – Send messages via email signed with HMAC (Hash-based Message Authentication Code).
- ✅ **Verify Digital Signatures** – Validate if a message and its HMAC signature match (ensuring authenticity).
- 🧑‍💻 **Full-Stack Implementation** – Built with React (Frontend) + Flask (Backend).
- 🌈 **Modern UI** – Clean, responsive UI styled with TailwindCSS and Lucide icons.

---

## 🛠 Tech Stack

**Frontend:**
- React
- Axios
- Tailwind CSS
- Lucide React Icons

**Backend:**
- Flask (Python)
- Flask-Mail
- Flask-Bcrypt
- SQLite (via SQLAlchemy)
- Cryptography (AES)
- HMAC (hashlib)

---

## 🧰 Installation & Setup

> Ensure you have **Python 3**, **Node.js**, and **npm** installed.

### 🔙 Backend

1. Clone the repository and navigate to backend:

   ```bash
   git clone https://github.com/yourusername/secure-data-handling.git
   cd secure-data-handling/backend
   ```

2. Create a `.env` file and add your email credentials:

   ```
   EMAIL=your_email@gmail.com
   PASSWORD=your_email_password
   ```

3. Install dependencies and run the server:

   ```bash
   pip install -r requirements.txt
   python app.py
   ```

### 🎨 Frontend

1. Open a new terminal and navigate to the frontend:

   ```bash
   cd ../frontend
   ```

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

---

## 🧪 Usage

### ✅ Add User
- Fill in name and password.
- The name is AES-encrypted, and password is hashed with Bcrypt.

### 🔓 Decrypt Users
- Enter a password.
- Users whose password hash matches will be decrypted.

### 📧 Send Email
- Enter recipient and message.
- Message is signed using HMAC and emailed via Gmail SMTP.

### 🛡️ Verify Signature
- Paste message + HMAC signature to verify authenticity.

---

## 📁 Project Structure

```
INS_SECURE_DATA/
├── backend/
│   ├── instance/
│   │   └── users.db
│   ├── venv/
│   ├── .env
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── dist/
    ├── node_modules/
    ├── public/
    └── src/
        ├── components/
        │   └── Frontpage.jsx
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

---

## 💡 Icons Used

- `UserPlus` – Add user
- `Unlock` – Decrypt users
- `Mail` – Secure email
- `ShieldCheck` – Signature verification

All icons are from [Lucide Icons](https://lucide.dev/).

---

## ⚠️ Security Notes

- Use strong passwords for email credentials.
- Never commit your `.env` file to GitHub.
- Replace the hardcoded HMAC `secret_key` with a secure secret from environment variables.
- Always run HTTPS in production (currently hosted on Render with SSL).

---

## ✨ Credits

Built with ❤️ by [Adithya/GitHub Profile](<https://github.com/Aditya-rao-1>)


---

Let me know if you want a `requirements.txt`, `.env.example`, or the icons styled differently.
