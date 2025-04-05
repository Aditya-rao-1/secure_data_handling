import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ShieldCheck, UserPlus, Unlock } from 'lucide-react';
import '../index.css';

const Frontpage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [globalPassword, setGlobalPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignatureText, setVerifySignatureText] = useState('');
  const [users, setUsers] = useState([]);
  const [emailDetails, setEmailDetails] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://secure-data-handling.onrender.com/add-user', { name, password });
      setUsers(res.data.users || []);
      setName('');
      setPassword('');
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleDecrypt = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('https://secure-data-handling.onrender.com/decrypt', { globalPassword });
      setUsers(res.data.users || []);
      setGlobalPassword('');
    } catch (err) {
      console.error('Error decrypting users:', err);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://secure-data-handling.onrender.com/send-email', {
        email,
        message
      });
  
      if (res.data.emailDetails) {
        setEmailDetails(res.data.emailDetails);
        setEmail('');
        setMessage('');
      } else {
        console.warn('Email sent, but response format was unexpected:', res.data);
      }
  
    } catch (err) {
      console.error('Error sending email:', err);
  
      let errorMsg = 'Failed to send email. Please try again later.';
  
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      }
  
      setEmailDetails({
        recipient: email,
        message: message,
        signed: false,
        time: new Date().toISOString(),
        error: errorMsg
      });
    }
  };
  

  const handleVerifySignature = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('https://secure-data-handling.onrender.com/verify-signature', {
            message: verifyMessage,
            signature: verifySignatureText,
          });
      setVerifyResult(res.data.isValid);
      setVerifyMessage('');
      setVerifySignatureText('');
    } catch (err) {
      console.error('Error verifying signature:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-6 py-10 font-sans">
      <h1 className="text-5xl font-bold mb-12 text-center text-white drop-shadow-lg">🔐 Secure Data Handling</h1>

      {/* Secure Data Storage */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white justify-center">
          <UserPlus size={28} className="text-blue-400" />
          Secure Data Storage
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 max-w-5xl mx-auto space-y-6">
          <form onSubmit={handleAddUser} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="text"
              placeholder="Enter password to encrypt"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Add User
            </button>
          </form>

          <ul className="space-y-3">
            {users.length > 0 ? (
              users.map((user, i) => (
                <li key={i} className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-sm">
                  <span><strong>Name:</strong> {user.name}</span><br />
                  <span><strong>Password:</strong> {user.password}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No users to display.</li>
            )}
          </ul>

          <form onSubmit={handleDecrypt} className="flex flex-wrap gap-4 items-center pt-4 border-t border-gray-700 mt-4">
            <input
              type="text"
              placeholder="Enter global password"
              value={globalPassword}
              onChange={(e) => setGlobalPassword(e.target.value)}
              required
              className="input-field flex-1"
            />
            <button type="submit" className="btn-success">
              <Unlock size={18} /> Decrypt All
            </button>
          </form>
        </div>
      </section>

      {/* Secure Email Transmission */}
      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white justify-center">
          <Mail size={28} className="text-pink-400" />
          Secure Data Transmission
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 max-w-4xl mx-auto space-y-6">
          <form onSubmit={handleSendEmail} className="space-y-4">
            <input
              type="email"
              placeholder="Enter recipient's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <textarea
              placeholder="Enter your message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Send Email with Signature
            </button>
          </form>

          {emailDetails && (
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">📤 Email Sent</h3>
              <p><strong>Recipient:</strong> {emailDetails.recipient}</p>
              <p><strong>Time:</strong> {emailDetails.time}</p>
              <p><strong>Signed:</strong> {emailDetails.signed ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Verify Digital Signature */}
      <section>
        <div className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white justify-center">
          <ShieldCheck size={28} className="text-green-400" />
          Verify Digital Signature
        </div>

        <p className="mb-4 text-sm text-center text-gray-400">Check your email & paste the message and signature below.</p>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 max-w-4xl mx-auto space-y-4">
          <form onSubmit={handleVerifySignature} className="space-y-4">
            <textarea
              placeholder="Enter message to verify"
              rows="4"
              value={verifyMessage}
              onChange={(e) => setVerifyMessage(e.target.value)}
              required
              className="input-field"
            />
            <textarea
              placeholder="Enter signature to verify"
              rows="4"
              value={verifySignatureText}
              onChange={(e) => setVerifySignatureText(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" className="btn-primary">Verify Signature</button>
          </form>

          {verifyResult !== null && (
            <div className={`p-4 rounded-xl shadow text-white ${verifyResult ? 'bg-green-700' : 'bg-red-700'}`}>
              {verifyResult ? '✅ Signature is valid. The email is authentic.' : '❌ Signature is invalid. Beware!'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Frontpage;
