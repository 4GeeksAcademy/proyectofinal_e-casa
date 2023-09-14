import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import logoecasa from "../../img/logoe-casa.png";

export const Navbar = () => {

	const { store, actions } = useContext(Context);

	return (
		<nav className="fixed-top navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<img className="ms-2" src={logoecasa} alt="logo ecasa" style={{ width: "30px" }} />
				</Link>
				{store.auth ?
					<div className="ml-auto">
						<Link to="/login">
							<button onClick={() => actions.logout()} className="btn btn-primary">Cerrar sesión</button>
						</Link>
					</div>
					:
					<div className="ml-auto">
						<Link to="/login">
							<button className="btn btn-primary">Iniciar sesión</button>
						</Link>
					</div>
				}</div>
		</nav>
	);
};
