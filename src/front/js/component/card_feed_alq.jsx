import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import  { useState, useEffect, useContext } from 'react';

export const CardFeedAlq = (props) => {
    const { store, actions } = useContext(Context)
    return (
        <div style={{ width: "18rem" }}>
            <img src={props.imageUrl}className="card-img-top" alt="..." />
            <div className="azul-oscuro mb-5">
                <div className="d-flex justify-content-between">
                    <strong className="card-title">{props.ubicacion}</strong>
                    <p className="card-text">$ {props.precio}</p>
                </div>
                <div className="d-flex justify-content-between px-1">
                    <i className="fa-regular fa-heart"></i>
                    <Link to={"/details/" + props.id}><p>Ver detalles</p></Link>
                </div>
            </div>
        </div>
    );
};

CardFeedAlq.propTypes = {
    
    ubicacion: PropTypes.string,
    precio: PropTypes.number,
    id:PropTypes.number,
    imageUrl: PropTypes.string
};