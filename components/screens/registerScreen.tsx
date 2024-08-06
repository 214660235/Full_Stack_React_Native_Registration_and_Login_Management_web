
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid Gmail address.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/register', { email, password });
      console.log(response.data);
      setSuccessMessage('Registration successful!'); // הצגת הודעת הצלחה
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error registering, please try again.');
      setSuccessMessage('');
      console.error('Error registering:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const user = await auth().signInWithCredential(googleCredential);

      await axios.post('http://127.0.0.1:5000/google-register', {
        email: user.user.email,
        google_id: user.user.uid,
      });

      setSuccessMessage('Login with Google successful!'); // הצגת הודעת הצלחה
      setErrorMessage('');
      // Navigate to the next screen or perform additional actions
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.log('Some other error happened', error);
      }
      setErrorMessage('Error signing in with Google, please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/sss.png')} style={styles.logo} />
      <Text style={styles.title}>Register</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.alternativeLogin}>
        <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
          <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../../assets/images/Facebook_Icon.png')} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#3949AB',
    fontWeight: '600',
    marginBottom: 20,
  },
  errorText: {
    color: '#FFA500',
    marginBottom: 20,
  },
  successText: {
    color: '#28a745',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  registerButton: {
    width: '100%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#9FA5D1',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#7B7B7B',
    fontSize: 14,
  },
  alternativeLogin: {
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#4a4db8',
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#4a4db8',
    fontSize: 16,
  },
  switchText: {
    color: '#8368B3',
  },
});

export default RegisterScreen;
