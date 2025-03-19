import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/auth.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName || '',
        email: email,
      });
      
      console.log('User signed up:', user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h5" className="auth-header">Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="auth-textfield"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name (Optional)"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="auth-textfield"
              />
            </Grid>
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
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>

        <a href="/login" className="auth-link">Already have an account? Login</a>
      </Paper>
    </div>
  );
};

export default SignUp;