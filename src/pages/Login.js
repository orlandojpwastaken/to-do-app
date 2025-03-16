import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h5" className="auth-header">Login</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-textfield"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-textfield"
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography className="auth-error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-button"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>

        <a href="/signup" className="auth-link">Don't have an account? Sign Up</a>
      </Paper>
    </div>
  );
};

export default Login;
