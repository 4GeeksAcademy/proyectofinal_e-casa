import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import { useParams, useLocation, Link } from 'react-router-dom';
import diego from "../../img/diego.jpg";
import { Comentarios } from '../component/comentarios_casas.jsx';
import { PanelCtrl } from "../component/panel_control.jsx";
import "../../styles/Details.css";

function Details() {
  const { store, actions } = useContext(Context)
  let param = useParams()
  useEffect(() => {
    actions.getDetalles(param.id)
    actions.getPerfilProp(store.casa.info_propietario?.user_id)
  }, [])

console.log(store.casa.info_propietario?.user_id);

  return (
    <div className='details-container container mx-auto row d-flex cuerpo mt-5'>
      <div className="mt-3 d-block"></div>
      <Link to={"/"} className="text-decoration-none my-2 continue-navigation"><span className="text-dark w-25 my-4"><i className="fa-solid fa-arrow-left-long me-2"></i><span>Seguir navegando</span></span></Link>
      <div className="details-card-container col-12">

        <div className="card-header bigger-screen d-flex" style={{ height: "430px" }}>
          {store.casa?.images?.map((img) => (
            <img src={img.url} className="details-card-img" style={{ maxWidth: "100%", width: "20px", flexGrow: "1", objectFit: "cover", opacity: ".9", transition: ".5s ease" }} />
          ))}
        </div>





        <div id="carouselExampleControls" className="carousel slide mobile-images" data-bs-ride="true">
          <div className="carousel-inner" >
            <div className="carousel-inner" style={{ height: "300px" }}>
              {store.casa?.images?.map((img, index) => (
                <div className={`carousel-item justify-content-center text-center ${index === 0 && "active"}`}>
                  <img src={img.url} className="details-card-img" style={{ height: "300px" }} />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/*<div className="card-header d-flex row">
          {store.casa?.images?.map((img, index) => (
            index <= 5 &&
              <>
                {index == 1 && <div className="object-fit-cover col-6">
                  <img src={img.url} className={`object-fit-cover p-1`} alt="..." />
                </div>}
                <div>
                  <img src={img.url} className={`object-fit-cover col-3 p-1`} alt="..." />
                </div>
              </>
          ))}
        </div>]*/}


        <div className="card-body details-card-body">
          <h2 className="card-title">{store.casa.title}</h2>

          <p className="text-white bg-azul-oscuro d-flex details-btn justify-content-center btn my-4">{store.casa.category}</p>
          <h6 className='disponible'>Localización: {store.casa.location}</h6>
          <p className="card-text"><strong>Alojamiento entero: departamento con servicios incluidos. <br />Anfitrión: {store.propietario?.name}</strong></p>
          <p className='detalle'>{store.casa.numberOfRooms} Habitaciones - {store.casa.numberOfBathrooms} Baños - 250mt2 </p>

        </div>
        <ul className="list-group details-list-group list-group-flush">
          <div className='d-flex justify-content-between'>
            <div>
              <p className='mb-0'><strong>${store.casa.price} Mensual </strong></p>
              <p className='disponible mb-0'>Disponible ahora</p>
            </div>
            <Link to={"/perfilprop"}><button type="submit" className="btn text-white bg-azul-oscuro  mx-auto rounded my-4 me-3 details-btn">Alquilar</button></Link>
          </div>
          <li className="list-group-item details-list-group bg-celeste-claro mt-4 ms-0 ps-0"><p className="ps-0 ms-0">{store.casa.description}</p></li>
          <div className='d-flex mt-2 '>
            <div className=''>
              <li className="list-group-item details-list-group duenio"><p>{store.casa.info_propietario?.name} {store.casa.info_propietario?.lastname}</p> <br />
                <p className='registro'>{store.casa.info_propietario?.account_creation_date}</p>
              </li>
            </div>

            {store.propietario?.profile_picture == "" ? <img src={diego} style={{ width: "50px", height: "50px" }} className="rounded-circle " alt="..." />:

            <img src={store.casa.info_propietario?.profile_picture}style={{ width: "50px", height: "50px" }} className="rounded-circle" alt="..." />}
          </div>

          <li className="list-group-item details-list-group bg-celeste-claro ps-0 ms-0 mt-4">Soy de Uruguay, Sudamérica

            Alterno viviendo entre la capital Montevideo y Punta del Este en el departamento de Maldonado. Punta Ballena es uno de los lugares más bonitos de Sudamérica en Punta del Este.</li>
        </ul>
        <h5 className='mt-3 mb-2 comments'>Comentarios:</h5>
        <div className="comments d-flex " style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}>
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />
          <Comentarios />

        </div>

      </div>
      <PanelCtrl />
    </div>
  );
};





export default Details