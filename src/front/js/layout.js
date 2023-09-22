import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import Singup from "./pages/signup.js";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Login } from "./pages/login.jsx";
import Details from "./pages/detallesdecasas";
import Detailsventas from "./pages/detalle_casas_venta";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Perfil from "./pages/perfilUsuario";
import { Upload } from "./pages/Upload.jsx";
import { Favoritos } from "./pages/favoritos.jsx";
import { EditUserView } from "./pages/EditUserView.jsx"
import PerfilProp from "./pages/perfilPropietario";
import VistaNosotros from "./pages/vista_nosotros.jsx";
import Editarperfil from "./pages/editar_perfil";
import {Propiedades} from "./pages/propiedades.jsx";
import { EditProp } from "./pages/edit_prop.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Singup />} path="/signup" />
                        <Route element={<Details />} path="/details/:id" />
                        <Route element={<Upload />} path="/upload" />
                        <Route element={<EditUserView />} path="/edituser" />
                        <Route element={<Detailsventas />} path="/detailsventas/:id" />
                        <Route element={<Perfil />} path="/perfil" />
                        <Route element={<Favoritos />} path="/favoritos" />
                        <Route element={<PerfilProp />} path="/perfilprop" />
                        <Route element={<VistaNosotros />} path="/comp-nosotros" />
                        <Route element={<Editarperfil />} path="/editarperfil" />
                        <Route element={<Propiedades />} path="/mis-propiedades" />
                        <Route element={<EditProp />} path="/editar/mis-propiedades/:id" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

