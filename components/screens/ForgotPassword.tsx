import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Email input, 2: Token and new password input, 3: Success message

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    try {
      // בדוק אם האימייל קיים במערכת
      const emailExistsResponse = await fetch('http://127.0.0.1:5000/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const emailExistsData = await emailExistsResponse.json();
      if (!emailExistsData.exists) {
        setError('Email does not exist');
        return;
      }

      // שלח בקשת איפוס סיסמה
      const response = await fetch('http://127.0.0.1:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
      setStep(2);
      setSuccess(true);
    } catch (error) {
      setError('There was an error processing your request!');
      console.error(error);
    }
  };

  const handleTokenSubmit = async () => {
    if (!token || !newPassword) {
      setError('Token and new password are required');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, new_password: newPassword }),
      });
      const data = await response.json();
      console.log(data);
      if (data.message === "Password has been reset successfully") {
        setSuccess(true);
        setStep(3);
      } else {
        setError('Invalid token or email');
      }
    } catch (error) {
      setError('There was an error processing your request!');
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button title="Send Reset Link" onPress={handleForgotPassword} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        );
      case 2:
        return (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Token"
              value={token}
              onChangeText={setToken}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Button title="Submit" onPress={handleTokenSubmit} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        );
      case 3:
        return <Text>Password has been reset successfully.</Text>;
      default:
        return null;
    }
  };

  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Forgot Password</Text>
        {renderStep()}
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: 250,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default ForgotPassword;
