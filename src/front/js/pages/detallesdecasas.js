import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import { useParams, useLocation, Link } from 'react-router-dom';
import diego from "../../img/diego.jpg";
import { Comentarios } from '../component/comentarios_casas.jsx';
import { PanelCtrl } from "../component/panel_control.jsx";


function Details() {
  const { store, actions } = useContext(Context)
  let param = useParams()
  useEffect(() => {
    // actions.getAlquileres()
    actions.getDetalles(param.id)
  }, [])




  return (
    <div className='row d-flex cuerpo mt-5'>

      <div className="col-12" style={{ width: "90rem" }}>
        <Link to={"/"}><button type="submit" className="btn text-white bg-azul-oscuro  rounded-pill w-25 my-4">Volver</button></Link>
        <img src={store.casa.image_url} className="card-img-top" alt="..." />
        <div className="card-body">
          <h2 className="card-title">{store.casa.title}</h2>

          <p className="text-white bg-azul-oscuro d-flex justify-content-center w-25 btn my-4">{store.casa.category}</p>
          <h6 className='disponible'>Localización: {store.casa.location}</h6>
          <p className="card-text"><strong>Alojamiento entero: departamento con servicios incluidos. <br />Anfitrión: Armando A.</strong></p>
          <p className='detalle'>{store.casa.numberOfRooms} Habitaciones - {store.casa.numberOfBathrooms} Baños - 250mt2 </p>

        </div>
        <ul className="list-group list-group-flush">
          <div className='d-flex justify-content-between'>
            <p className='ms-3'><strong>${store.casa.price} Mensual </strong></p> <br />
            
             <p className='disponible'>Disponible ahora</p>
             <button type="submit" className="btn text-white bg-azul-oscuro  mx-auto rounded-pill w-25 my-4 me-3 ">Alquilar</button>
          </div>
          <li className="list-group-item bg-celeste-claro mt-4"><p>{store.casa.description}</p></li>
          <div className='d-flex mt-4'>
            <div className='ms-3'>
              <li className="list-group-item duenio"><p>Dueño: Pablo Bullor</p> <br />
                <p className='registro'>Se registró en mayo del 2015</p>
              </li>
            </div>

            <img src={diego} style={{ width: "50px", height: "50px" }} className="rounded-circle ms-4" alt="..." />
          </div>

          <li className="list-group-item bg-celeste-claro mt-4">Soy de Uruguay, Sudamérica

            Alterno viviendo entre la capital Montevideo y Punta del Este en el departamento de Maldonado. Punta Ballena es uno de los lugares más bonitos de Sudamérica en Punta del Este.</li>
        </ul>
        <h5 className='ms-3 mt-3'>Comentarios:</h5>
        <div className="d-flex " style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}>
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />

        </div>

      </div>{
        store.auth ?
          <PanelCtrl /> : null
      }</div>
  );
};





export default Details
