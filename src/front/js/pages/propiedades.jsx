import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { CardProp } from "../component/card_propiedad.jsx"
import { CardHouseFeed } from "../component/CardHouseFeed.jsx"
import { CardFav } from "../component/card_favorito.jsx"
import { PanelCtrl } from "../component/panel_control.jsx";



export const Propiedades = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getCasasProp(localStorage.getItem("prop_id"))
    }, [])

    return (
        <div className="pt-5 px-5 row">
            <h1 className="text-black my-5">Administrar mis Propiedades</h1>
            {store.casaPropietario.map((item, index) => {
                return (
                    <CardProp
                        key={index}
                        title={item.title}
                        location={item.location}
                        price={item.price}
                        id={item.id}
                        description={item.description}
                        category={item.category}
                        parking={item.parking}
                        wifi={item.wifi}
                        images={item.images['0']} />
                )
            })}
            <PanelCtrl />
        </div>
    );
};