import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useState, useEffect, useContext } from 'react';


export const CardProp = (props) => {
    const { store, actions } = useContext(Context)

    return (
        <>
            <div className="col-12 col-md-6 col-xl-4 my-2">
                <div className="m-1 border border-2 rounded-3 row px-2 py-3">
                    <div className="d-flex">
                        <img src={props.images.url} style={{objectFit: "contain"}} className="rounded rounded-4 col-4" alt="La imagen de su propiedad" />
                        <div className="card-body pe-0 py-0 col-8">
                            <h4 className="fw-bold m-0">{props.title}</h4>
                            <p className="card-text m-0"><small>{props.description}</small></p>
                            <p className="card-text m-0">{props.wifi ? <small>Wifi: ✔️</small> : <small>Wifi: ✖️</small>}</p>
                            <p className="card-text">{props.parking ? <small>Estacionamiento: ✔️</small> : <small>Estacionamiento: ✖️</small>}</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between px-3 float-end">
                        <div>
                            <p className="card-text m-0"><small className="text-body-secondary">{props.location}</small></p>
                            <p className="card-text"><small className="text-body-secondary">
                                {props.category} a </small>{props.category == "Venta" ? <small>USD${props.price}</small> : <small>${props.price}</small>}
                            </p>
                        </div>
                        <div className="my-auto">
                            <button className="btn">
                                <Link to={"/editar/mis-propiedades/" + props.id}><i className="fa-solid fa-pencil"></i></Link>
                            </button>
                            <button className="btn" onClick={() => { alert("deberia borrarse pero no lo hace") }}>
                                <i className="fa-solid fa-trash text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CardProp.propTypes = {

    location: PropTypes.string,
    id: PropTypes.number,
    images: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    parking: PropTypes.bool,
    wifi: PropTypes.bool,

};