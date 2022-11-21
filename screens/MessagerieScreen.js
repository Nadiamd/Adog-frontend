import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Room from "../components/Room";
import IP_VARIABLE from "../variable";

import { useSelector } from "react-redux";

export default function MessagerieScreen() {
  const [conversations, setConversations] = useState([]); //initialisation de l'état conversation qui a pour valeur un tableau vide
  const user = useSelector((state) => state.user.value); //on récupère la valeur de user dans le reducer

  useEffect(() => {
    // useEffect d'initialisation pour récupérer nos conversations : va consulter la route mes conversations via le token en paramètre
    fetch(`https://${IP_VARIABLE}/messages/mesconversations/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        // en faisant un console.log de data on retrouve bien l'id de la room dans le data.rooms ( data est un tableau et rooms est une propriété du tableau)
        setConversations(data.rooms); // on set conversation avec data.rooms
      });
  }, []);

  const listeDesRooms = conversations.map((data, i) => {
    //on crée une variable : listeDesRomms et on fait un .map (cette varibale est égale au map de nos conversation)
    let otherUserName; // on crée une variable otherUserName à ce niveau car on ne pourra pas la créer dans la condition

    if (user.name === data.userOne.name) {
      // si mon nom (qui est dans le reducer) = userOne alors
      otherUserName = data.userTwo.name; // otherUserName = userTwo
    } else {
      otherUserName = data.userOne.name; // sinon otherUserName = userOne
    }
    return <Room key={i} name={otherUserName} idRoom={data._id} />; //  return les rooms
  });

  let listeDeConversations;

  if (conversations.length !== 0) {
    // si une conversation existe,
    listeDeConversations = // on injecte dans la "listeDesConversation" une scrallView avec à l'intérieur la liste des rooms (c'est .map que nous avons écrit précédement)
      (
        <ScrollView contentContainerStyle={styles.messagerie}>
          {listeDesRooms}
        </ScrollView>
      );
  } else {
    listeDeConversations = //s'il n'y a pas de conversation, on injectera une simple view avec un message disant qu'il n'y a pas de conversation
      (
        <View style={styles.messagerieVide}>
          <Text>Désolé vous n'avez pas encore de conversations</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={require("../images/logo.jpg")} />
      <Text style={styles.title}>Hello {user.name} !</Text>
      {listeDeConversations}
      {/* ici nous injectons la listeDesConversations que nous avons précédement préparées (soit une scrallview avec la lsite des rooms soit une view normale avec pas de conversation) */}
    </View>
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
    marginTop: "15%",
    width: "30%",
    height: "15%",
  },
  title: {
    color: "#F1890F",
    fontSize: "20%",
    fontWeight: "600",
    marginTop: "3%",
  },
  messagerie: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    height: "75%",
  },
  messagerieVide: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "75%",
  },
});
