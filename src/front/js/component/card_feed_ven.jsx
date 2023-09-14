import React from "react";
import casaImg from "../../img/casa-1.jpg";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import  { useState, useEffect, useContext } from 'react';

export const CardFeedVen = (props) => {
    const { store, actions } = useContext(Context)
    return (
        <div style={{width: "18rem"}}>
            <img src={props.imageUrl} className="card-img-top" alt="..."/>
            <div className="azul-oscuro mb-5">
                <div className="d-flex justify-content-between">
                    <strong className="card-title">{props.ubicacion}</strong>
                    <p className="card-text">US$ {props.precio}</p>
                </div>
                <div className="d-flex justify-content-between px-1">
                    <i className="fa-regular fa-heart"></i>
                    <Link to={"/detailsventas/" + props.id}><p>Ver detalles</p></Link>
                </div>
            </div>
        </div>
    );
};

CardFeedVen.propTypes = {
    
    ubicacion: PropTypes.string,
    precio: PropTypes.number,
    id: PropTypes.number,
    imageUrl: PropTypes.string

};