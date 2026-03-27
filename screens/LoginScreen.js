// LoginScreen
// - Purpose: Allows existing users to sign in. On success, stores JWT and navigates to main app.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import authApi from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password)
      return Alert.alert("Validation", "Email and password are required");
    setLoading(true);
    try {
      const data = await authApi.login(email.trim(), password);
      await login(data.token);
    } catch (err) {
      Alert.alert("Login failed", String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Text style={styles.title}>Backpack Cafe Market</Text>
      <View style={styles.gap}></View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Button title="Login" onPress={handleLogin} />
            <View style={{ height: 12 }} />
            <Button
              title="Register"
              onPress={() => navigation.navigate("Register")}
            />
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "orange",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 200,
    paddingBottom: 150,
    backgroundColor: "lightblue",
    textAlign: "center",
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
  },
  gap: { margin: 50 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
  },
});
