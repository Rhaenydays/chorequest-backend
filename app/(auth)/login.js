import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(
        "https://acdd-2603-6011-6b00-6d00-d1dc-bb36-87a5-ea42.ngrok-free.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("user_id", String(data.user_id));
        router.replace("/");
      } else {
        setErrorMsg(data.detail || "Login failed.");
      }
    } catch (err) {
      setErrorMsg("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔐 Login to ChoreQuest</Text>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        autoCapitalize="none"
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4b3b94" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={!username || !password}
        />
      )}

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.registerText}>
          🧙‍♂️ New here? Create your account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 30, marginTop: 80 },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#4b3b94"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center"
  },
  registerLink: { marginTop: 20, alignItems: "center" },
  registerText: {
    color: "#4b3b94",
    textDecorationLine: "underline",
    fontSize: 14
  }
});