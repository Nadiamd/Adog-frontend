import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import IP_VARIABLE from "../variable";

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(""); //initialisation des etats pour l'email et le password
  const [password, setPassword] = useState("");
  const [messagealert, setMessagealert] = useState("");

  const handleConnection = () => {
    fetch(`${IP_VARIABLE}/users/signin`, {
      // requete fetch avec notre adresse IP personnelle sur la route POST signin
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          setMessagealert("Désolé vos identifiants sont incorrects");
        }
        if (data.result) {
          dispatch(
            login({ email: data.email, token: data.token, name: data.name })
          ); // dispatch pour stocker les données dans le reducer
          setEmail("");
          setPassword("");
          navigation.navigate("TabNavigator", { screen: "Swipes" }); // permet la redirection vers la page swipes
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image style={styles.imageLogo} source={require("../images/logo.jpg")} />

      <TextInput
        placeholder="email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        style={styles.input}
      />

      <TextInput
        placeholder="password"
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={true}
        value={password}
        style={styles.input}
      />
      <Text style={styles.messagealert}>{messagealert}</Text>

      <TouchableOpacity onPress={() => handleConnection()} style={styles.go}>
        <Text style={styles.titleGo}>Go!</Text>
        <Image
          style={styles.imageButton}
          source={require("../images/GO.jpg")}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageLogo: {
    width: "60%",
    height: "25%",
  },
  input: {
    width: "80%",
    marginTop: "8%",
    borderBottomColor: "#F1890F",
    borderBottomWidth: 1,
    fontSize: "18%",
  },
  imageButton: {
    width: 100,
    height: 100,
    marginTop: "3%",
  },
  go: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleGo: {
    color: "#F1890F",
    fontSize: "20%",
    fontWeight: "600",
    marginTop: "10%",
  },
  messagealert: {
    margin: "0.9%",
    color: "red",
  },
});
