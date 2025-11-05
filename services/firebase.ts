import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log('🔥 [Firebase] Iniciando configuração do Firebase...');

const firebaseConfig = {
  apiKey: "AIzaSyDo-BkCbXQxp3AxCN2KQSeds_7-WbZsMfk",
  authDomain: "augenda-pet.firebaseapp.com",
  projectId: "augenda-pet",
  storageBucket: "augenda-pet.appspot.com",
  messagingSenderId: "896648056215",
  appId: "1:896648056215:web:ad732a2b3eba625bc4c8d2",
  measurementId: "G-KJENFC6Q34"
};

console.log('🔥 [Firebase] Configuração:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

console.log('🔥 [Firebase] Inicializando app...');
const app = initializeApp(firebaseConfig);
console.log('🔥 [Firebase] App inicializado com sucesso');

console.log('🔥 [Firebase] Inicializando Auth...');
const auth = getAuth(app);
console.log('🔥 [Firebase] Auth inicializado com sucesso');

console.log('🔥 [Firebase] Inicializando Firestore...');
const db = getFirestore(app);
console.log('🔥 [Firebase] Firestore inicializado com sucesso');

console.log('🔥 [Firebase] Configuração completa!');

export { app, auth, db };
