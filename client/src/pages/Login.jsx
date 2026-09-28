import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice'; // Ajustez le chemin selon votre structure

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulation de la vérification admin / client
    const role = email.includes('admin') ? 'admin' : 'client';

    const userData = {
      user: { name: role === 'admin' ? 'Administrateur' : 'Client', role: role, email: email },
      token: 'fake-jwt-token-123456',
    };

    // 1. Mise à jour de Redux et du localStorage
    dispatch(setCredentials(userData));

    // 2. Redirection vers la page d'accueil
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label>Email :</label>
          <input
            type="email"
            placeholder="Ex: admin@store.tn ou client@store.tn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label>Mot de passe :</label>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Se connecter</button>
      </form>
      <small style={{ marginTop: '15px', color: '#666', display: 'block' }}>
        💡 Pour tester le compte Admin, utilisez un email contenant "admin" (ex: admin@test.com).
      </small>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  group: { display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
};