import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from '../features/cartSlice'; // Ajustez le chemin d'accès vers votre cartSlice si nécessaire

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // <--- Ajout indispensable pour que le panier fonctionne !
  },
});