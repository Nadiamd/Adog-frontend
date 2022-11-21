import { createSlice } from "@reduxjs/toolkit"; // outil createSlice, permet d'initialiser le nom de notre reducer, sa valeur par défaut et les actions que nous souhaitons mettre en place pour le modifier.

const initialState = { // on initailise la valeur de nos états
  value: { email:null, name:null, breed:null, age:null, gender: null, vaccins: false,
  aboutMe: null, aboutMyOwner: null, images: [], token: null, room:[] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.name = action.payload.name;
      state.value.email = action.payload.email;
      state.value.token = action.payload.token;
    }, //fonction permettant de récupérer les valeurs : name, email, token afin de les réutiliser par la suite 
    updateProfil: (state, action) => {
      state.value.name = action.payload.name;
      state.value.breed = action.payload.breed;
      state.value.age = action.payload.age;
      state.value.gender = action.payload.gender;
      state.value.vaccins = action.payload.vaccins;
      state.value.aboutMe = action.payload.aboutMe;
      state.value.aboutMyOwner = action.payload.aboutMyOwner;
      state.value.images.push(action.payload.images);
    }, // fonction permettant de récupérer les autres valeurs : breed,age, etc..  afin de pouvoir les réutiliser par la suite 
    addPhoto: (state, action) => {
      state.value.images.push(action.payload);
     // fonction qui permet d'importer des photos
    },
    addRoom: (state, action) => {
      state.value.room = action.payload;
    }, //fonction qui permet de créer la room 
    addOtherUserName: (state, action) => {
      state.value.otherusername = action.payload;
    }, // hmida
    deleteRoom: (state) => {
      state.value.room = null
    },
    logout: (state) => {
      state.value.email = null;
      state.value.name = null;
      state.value.breed = null;
      state.value.age = null;
      state.value.gender = null;
      state.value.vaccins = null;
      state.value.aboutMe = null;
      state.value.aboutMyOwner = null;
      state.value.images = [];
      state.value.token = null;
      state.value.room = null;
    }, // fonction qui permet à l'utilisateur de se deconnecter
}
})

export const { login, updateProfil, addPhoto, addRoom, addOtherUserName, deleteRoom,logout } = userSlice.actions;  // export des fonction et du reducer pour pouvoir les utiliser
export default userSlice.reducer;