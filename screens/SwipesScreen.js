import React from "react";
import { Image, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useEffect, useState } from "react"; //  import de la fonction (useState) permettant d'initialiser des états et leur setter. Cette fonction est appelée Hook d’état.
import { useSelector } from "react-redux"; // import du useSelector hook permettant de récupérer une valeur du store
import Swiper from "react-native-deck-swiper"; // import composant swiper qui permetttra de mettre en place la dynamique de swipe
import IP_VARIABLE from "../variable";

//--------------------------------------------------------------------------------------------

export default function SwipesScreen({ navigation }) {
  // navigation permet de naviguer vers le match screen au moment du match

  const user = useSelector((state) => state.user.value);

  const [cardsData, setCardsData] = useState([]); // initialisation de l'etat cardsData qui aura comme valeur initiale un tableau vide
  console.log(cardsData);
  // Permet d'afficher les cards contenant les informations des users
  useEffect(() => {
    fetch(`https://${IP_VARIABLE}/users/allusers/${user.token}`) // on fetch sur notre base de données en backend pour récupérer les données des users qui figurent sur chaque card
      .then((response) => response.json())
      .then((data) => {
        const cardsData = data.map((data) => {
          // permet de maper sur la colection users dans la base de donées (Tableau contenant toutes les infos users qui s'appelle data)
          const name = data.name;
          const age = data.age;
          const gender = data.gender;
          const images = data.images[0];
          const breed = data.breed;
          const token = data.token;
          const idUser = data._id;
          return { name, breed, age, gender, images, token, idUser }; // on retourne chaque clé correspondant aux valeurs que l'on veut voir apparaitre
        });
        setCardsData(cardsData);
        //  on set CardsData pour recupèrer toutes les data des users de notre base de données
      });
  }, []);

  const handleRight = (event) => {
    // event permet de rentrer en contact avec l'object sur lequel on veut intervenir
    fetch(`https://${IP_VARIABLE}/users/updatelike/${user.token}`, {
      // on fetch sur le backend vers la route put pour mettre à jour les likes
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cardsData[event].idUser, // permet de récupérer l'id du user de la card likée
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // NB: le resultat sera à false dans le cas où l'autre user ne m'a pas liké car pour que le result soit à true, il faut que la condition (générée en backend) soit respectée et que les id des 2 users soinent dans les tableaux isLikedBy respectifs
          navigation.navigate("Match");
        }
      });
    onSwiped("right");
  };

  //--------------------------------------------------------------------------------------------

  const [index, setIndex] = useState(0); // d'initialisation de l'etat index à 0
  const onSwiped = (type) => {
    // fonction onSwiped pour faire défiler les cards l'une après l'autre en fonction de leur index
    setIndex(index + 1);
    //on set l'Index pour qu'il ajoute 1 à chaque fois - cela correspond au défielement des cards une à une
  };

  // on map sur cardsData ( notre etat initial qu'on a set) : le taleau cardsData contient toutes les data des users.
  const cards = cardsData.map((data, i) => {
    //console.log("ici c'est cadsdata", cardsData)
    return (
      <View key={i}>
        <View>
          <Image source={{ uri: data.images }} style={styles.image} />
          <View style={styles.containertext}>
            <Text style={styles.nametext}>{data.name} </Text>
            <Text style={styles.breedtext}>{data.breed} </Text>
            <Text style={styles.genderagetext}>
              {data.age} ans {data.gender}
            </Text>
            {cards}
          </View>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require("../images/logo.jpg")} />
      <SafeAreaView style={styles.containerCard}>
        <Swiper
          cards={cards}
          animateOverlayLabelsOpacity
          animateCardOpacity
          disableTopSwipe
          disableBottomSwipe
          infinite
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "#ec6ebl5b",
                  color: "white",
                  fontsize: 15,
                  justifyContent: "center",
                  marginLeft: "60%",
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: "10%",
                },
              },
            },
            right: {
              title: "YEAH",
              style: {
                label: {
                  backgroundColor: "transparent",
                  color: "white",
                  justifyContent: "center",
                  fontsize: 15,
                  marginRight: "60%",
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: "10%",
                },
              },
            },
          }}
          renderCard={(card) => {
          
            // console.log("card:", card)
            return <View style={styles.card}>{card}</View>;
          }}
          onSwiped={(cardIndex) => {
            //console.log(cardIndex);
          }}
          onSwipedRight={(event) => {
            // console.log("tete", event);
            handleRight(event);
          }}
          onSwipedLeft={() => onSwiped("left")}
          onSwipedAll={() => {
            //console.log("onSwipedAll");
          }}
          cardIndex={0}
          backgroundColor={"white"}
          stackSize={3}
        ></Swiper>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logo: {
    height: "10%",
    width: "18%",
    marginTop: "3%",
    marginBottom: "3%",
    marginLeft: "42%",
  },
  containerCard: {
    flex: 1,
  },
  image: {
    width: 375,
    height: 460,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  containertext: {
    marginLeft: "2%",
  },
  card: {
    flex: 0.7,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  nametext: {
    color: "black",
    fontSize: "30%",
    marginTop: "5%",
  },
  breedtext: {
    color: "grey",
    fontSize: "20%",
    marginBottom: "3%",
  },
  genderagetext: {
    color: "grey",
    fontSize: "17%",
    marginBottom: "25%",
  },
});
