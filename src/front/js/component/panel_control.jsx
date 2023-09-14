import React, {useContext} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import diego from "../../img/diego.jpg";
import { Context } from '../store/appContext';


export const PanelCtrl = () => {
    const { store, actions } = useContext(Context)
    return (
        <div className="bg-celeste-claro py-2 fixed-bottom mt-auto text-center azul-oscuro d-flex justify-content-around">
            <i style={{ fontSize: "40px" }} className="fa-regular fa-heart"></i>
            {/*<Link to={"/"}>
                 <button style={{ width: "40px", height: "40px" }} className="btn borde-azul-oscuro border-3 rounded-circle p-auto">
                    <i className="fa-solid fa-plus"></i>
                </button> 
            </Link>*/}
            <Link to={"/perfil"}>
                <img src={diego} style={{ width: "40px", height: "40px" }} className="rounded-circle" alt="..." />
            </Link>
        </div>
    );
};