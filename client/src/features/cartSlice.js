import { createSlice } from '@reduxjs/toolkit'; // Importation de la fonction createSlice depuis Redux Toolkit. Cette fonction est utilisée pour créer un "slice" de l'état global, qui inclut l'état initial, les reducers et les actions associées.
 
const initialState = {// Définition de l'état initial du panier d'achat. Ici, le panier est représenté par un tableau d'articles (items) qui est initialement vide.
  items: [], // items est un tableau qui contiendra les articles ajoutés au panier. Chaque article sera représenté par un objet contenant des informations telles que l'identifiant, le nom, le prix et la quantité.
};
 
const cartSlice = createSlice({ // Création du slice du panier d'achat en utilisant createSlice. Le slice contient le nom, l'état initial et les reducers qui définissent comment l'état peut être modifié.
  name: 'cart', // Le nom du slice est 'cart'. Ce nom est utilisé pour identifier le slice dans l'état global de l'application.
  initialState, // L'état initial du slice est défini par la constante initialState, qui contient un tableau vide d'articles.
  reducers: { // Les reducers sont des fonctions qui définissent comment l'état peut être modifié en réponse à des actions. Chaque reducer prend l'état actuel et une action, et retourne un nouvel état.
    addToCart: (state, action) => { // Le reducer addToCart est utilisé pour ajouter un article au panier. Il prend l'état actuel et une action contenant les informations de l'article à ajouter.
      const { id, name, price, quantity = 1 } = action.payload; // L'action payload contient les informations de l'article à ajouter, y compris l'identifiant (id), le nom (name), le prix (price) et la quantité (quantity). Si la quantité n'est pas spécifiée, elle est par défaut à 1.
      const existingItem = state.items.find((item) => item.id === id); // Vérification si l'article existe déjà dans le panier en recherchant un article avec le même identifiant (id) dans le tableau items. Si un article correspondant est trouvé, il est stocké dans la variable existingItem.
 
      if (existingItem) { // Si l'article existe déjà dans le panier, la quantité de cet article est augmentée de la quantité spécifiée dans l'action payload.
        existingItem.quantity += quantity; // Augmentation de la quantité de l'article existant dans le panier. La quantité actuelle de l'article est augmentée de la quantité spécifiée dans l'action payload.
      } else { // Si l'article n'existe pas dans le panier, un nouvel article est ajouté au tableau items avec les informations spécifiées dans l'action payload (id, name, price et quantity).
        state.items.push({ id, name, price, quantity }); // Si l'article n'existe pas dans le panier, un nouvel article est ajouté au tableau items avec les informations spécifiées dans l'action payload (id, name, price et quantity).
      }
    },
    increaseQuantity: (state, action) => { // Le reducer increaseQuantity est utilisé pour augmenter la quantité d'un article spécifique dans le panier. Il prend l'état actuel et une action contenant l'identifiant de l'article à augmenter.
      const { id } = action.payload; // L'action payload contient l'identifiant (id) de l'article dont la quantité doit être augmentée. La constante id est extraite de l'action payload.
      const item = state.items.find((item) => item.id === id); // Recherche de l'article correspondant dans le panier en utilisant l'identifiant (id) fourni dans l'action payload. La méthode find est utilisée pour parcourir le tableau items et trouver l'article avec l'identifiant correspondant.
      if (item) { // Si l'article est trouvé dans le panier, sa quantité est augmentée de 1.
        item.quantity += 1; // Augmentation de la quantité de l'article trouvé dans le panier. La quantité actuelle de l'article est augmentée de 1.
      }
    },
    decreaseQuantity: (state, action) => {
      const { id } = action.payload; // Le reducer decreaseQuantity est utilisé pour diminuer la quantité d'un article spécifique dans le panier. Il prend l'état actuel et une action contenant l'identifiant de l'article à diminuer.
      const item = state.items.find((item) => item.id === id); // Recherche de l'article correspondant dans le panier en utilisant l'identifiant (id) fourni dans l'action payload. La méthode find est utilisée pour parcourir le tableau items et trouver l'article avec l'identifiant correspondant.
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) { // Si la quantité de l'article devient inférieure ou égale à zéro, l'article est supprimé du panier en filtrant le tableau items pour exclure l'article avec l'identifiant correspondant.
          state.items = state.items.filter((item) => item.id !== id); // Si la quantité de l'article devient inférieure ou égale à zéro, l'article est supprimé du panier en filtrant le tableau items pour exclure l'article avec l'identifiant correspondant.
        }
      }
    },
    removeFromCart: (state, action) => { // Le reducer removeFromCart est utilisé pour supprimer un article spécifique du panier. Il prend l'état actuel et une action contenant l'identifiant de l'article à supprimer.
      const { id } = action.payload; // Le reducer removeFromCart est utilisé pour supprimer un article spécifique du panier. Il prend l'état actuel et une action contenant l'identifiant de l'article à supprimer.
      state.items = state.items.filter((item) => item.id !== id);// Le reducer removeFromCart est utilisé pour supprimer un article spécifique du panier. Il prend l'état actuel et une action contenant l'identifiant de l'article à supprimer. L'article est supprimé du panier en filtrant le tableau items pour exclure l'article avec l'identifiant correspondant.
    },
    clearCart: (state) => { // Le reducer clearCart est utilisé pour vider complètement le panier. Il prend l'état actuel et réinitialise le tableau items à un tableau vide, supprimant ainsi tous les articles du panier.
      state.items = []; // Réinitialisation du tableau items à un tableau vide, supprimant ainsi tous les articles du panier.
    },
  },
});
 
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions; // Exportation des actions générées par createSlice. Ces actions peuvent être utilisées dans les composants de l'application pour déclencher les reducers correspondants et modifier l'état du panier.
 
export const selectCartItems = (state) => state.cart?.items || []; // Exportation d'un sélecteur pour accéder aux articles du panier dans l'état global. Le sélecteur selectCartItems prend l'état global en paramètre et retourne le tableau items du slice cart. Cela permet aux composants de l'application d'accéder facilement aux articles du panier en utilisant useSelector.
export const selectCartTotal = (state) => // Exportation d'un sélecteur pour calculer le total du panier. Le sélecteur selectCartTotal prend l'état global en paramètre et utilise la méthode reduce pour calculer le total en multipliant le prix de chaque article par sa quantité et en additionnant les résultats. Cela permet aux composants de l'application d'afficher facilement le total du panier.
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0); // Exportation d'un sélecteur pour calculer le total du panier. Le sélecteur selectCartTotal prend l'état global en paramètre et utilise la méthode reduce pour calculer le total en multipliant le prix de chaque article par sa quantité et en additionnant les résultats. Cela permet aux composants de l'application d'afficher facilement le total du panier.
export const selectCartCount = (state) => // Exportation d'un sélecteur pour calculer le nombre total d'articles dans le panier. Le sélecteur selectCartCount prend l'état global en paramètre et utilise la méthode reduce pour additionner les quantités de tous les articles dans le panier. Cela permet aux composants de l'application d'afficher facilement le nombre total d'articles dans le panier.
  state.cart.items.reduce((count, item) => count + item.quantity, 0); // Exportation d'un sélecteur pour calculer le nombre total d'articles dans le panier. Le sélecteur selectCartCount prend l'état global en paramètre et utilise la méthode reduce pour additionner les quantités de tous les articles dans le panier. Cela permet aux composants de l'application d'afficher facilement le nombre total d'articles dans le panier.
 
export default cartSlice.reducer; // Exportation du reducer généré par createSlice. Le reducer est utilisé pour mettre à jour l'état du panier en réponse aux actions déclenchées par les composants de l'application. Il est importé dans le fichier store.js pour être combiné avec d'autres reducers et créer le store Redux global de l'application.