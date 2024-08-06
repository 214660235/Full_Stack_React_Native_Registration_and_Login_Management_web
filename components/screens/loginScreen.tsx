
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ForgotPassword from './ForgotPassword'; // הניחו שהקובץ של ForgotPassword נמצא באותו תיקיה

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      console.log(response.data);
      if (response.status === 200) {
        // Handle login success
        console.log("Login successful");
        Alert.alert("Success", "Login successful");
      }
    } catch (error: any) {
      if (error.response) {
        let errorMessage = '';
        switch (error.response.status) {
          case 400:
            errorMessage = 'Email and password are required.';
            break;
          case 401:
            errorMessage = 'Invalid email.';
            break;
          case 402:
            errorMessage = 'Incorrect password.';
            break;
          case 403:
            errorMessage = 'Email and password are incorrect.';
            break;
          default:
            errorMessage = `Unexpected error: ${error.response.data.error || error.message}`;
        }
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } else {
        setError('An unexpected error occurred. Please try again later.');
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    Alert.alert("Google Login", "Google login is not implemented yet.");
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login logic here
    Alert.alert("Facebook Login", "Facebook login is not implemented yet.");
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/sss.png')} style={styles.logo} />
      <Text style={styles.title}>Log in</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../../assets/images/Mail_Icon.png')} style={styles.icon} />
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
        <Image source={require('../../assets/images/Lock_Icon.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={require('../../assets/images/Eye_Icon.png')} style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.alternativeLogin}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image source={require('../../assets/images/google.png')} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <Image source={require('../../assets/images/Facebook_Icon.png')} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('register')}>
        <Text style={styles.registerText}>Have no account yet? Register</Text>
      </TouchableOpacity>

      <ForgotPassword open={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3949AB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    borderColor: '#ccc',
    borderWidth: 0,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#4a4db8',
    textDecorationLine: 'underline',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#9FA5D1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
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
  registerText: {
    color: '#4a4db8',
    textDecorationLine: 'underline',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
