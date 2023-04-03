<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Båstad Lunch</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="menu" v-for="menu in state.menus">
          <h2>{{ menu.name }}</h2>
          {{ menu.items }}
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

import { initializeApp } from "firebase/app";
import { Unsubscribe, collection, getFirestore, onSnapshot, query } from "firebase/firestore";
import { onMounted, onUnmounted, reactive } from 'vue';

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyDWlBYq2qb7IK-Bl7VLNTE7gdCvDPQJn-4",
  authDomain: "filiplindqvist-com-ea66d.firebaseapp.com",
  databaseURL: "https://filiplindqvist-com-ea66d.firebaseio.com",
  projectId: "filiplindqvist-com-ea66d",
  storageBucket: "filiplindqvist-com-ea66d.appspot.com",
  messagingSenderId: "530377340060",
  appId: "1:530377340060:web:503261eba6d4d2497fe959"
});


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const q = query(collection(db, 'bastad-lunch'));

type Menu = {
  name: string
  items: []
}

const state = reactive({
  unsubscribe: null as null | Unsubscribe,
  menus: [] as Menu[]
})
onMounted(() => {
  state.unsubscribe = onSnapshot(q, (querySnapshot) => {
    state.menus = [];
    querySnapshot.forEach((doc) => {
      state.menus.push(doc.data() as Menu);
    });
  });
})

onUnmounted(() => {
  if (state.unsubscribe) state.unsubscribe()
})

</script>

<style scoped>
#container {
  text-align: center;
  margin: 2em 2em;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
