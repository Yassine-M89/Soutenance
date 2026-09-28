import { StrictMode } from 'react'
import ReactDOM from "react-dom/client"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import {store} from "./store/store.js";
import {Provider} from "react-redux";


ReactDOM.createRoot(document.getElementById('root')).render(
<StrictMode>
<Provider store={store}>
<App /> </Provider> {/* Provider est un composant de react redux qui donne l'accès au store à toute l'application */}
</StrictMode>,
)