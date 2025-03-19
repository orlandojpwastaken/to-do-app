import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileDialog = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setEmail(userData.email || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open]);

  const handleSave = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { firstName, lastName });
        setEditing(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name (Optional)"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {editing ? (
          <>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)} color="primary" variant="contained">
            Edit
          </Button>
        )}
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
