import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import logoecasa from "../../img/logoe-casa.png";
import googleLogo from "../../img/logo-google.png";
import * as Yup from 'yup';
import { useFormik } from 'formik';

export const Login = () => {

    const [email, setEmail] = useState("")
    const [contrasena, setContrasena] = useState("")
    const { store, actions } = useContext(Context)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
    }

    const formik = useFormik({
        initialValues: {

            email: '',
            password: "",


        },
        validationSchema:
            Yup.object({
                email: Yup.string().email('Email inválido').required('Obligatorio'),
                password: Yup.string().min(8, 'Debe tener 8 caracteres o mas').required('Obligatorio'),

            }),
        onSubmit: values => {

            let logged = actions.login(values).then(res => {

                if (res == true) navigate("/")

            })
        },
    })

    return (
        <div className="mt-5 bg-white container">
            <Link to={"/"}>
                <div className="d-flex justify-content-center">
                    <img src={logoecasa} alt="logo ecasa" style={{ width: "55px" }} />
                </div>
            </Link>
            <p id="emailHelp" className="d-flex justify-content-center my-3">E-CASA</p>
            <form className="container my-4" onSubmit={formik.handleSubmit}>
                <h1>Entrar</h1>
                <p id="emailHelp" className="form-text my-3">Hola! Qué gusto verte</p>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label texto-amarillo">Email address</label>
                    <input type="email" name="email" id="email" className="form-control bg-celeste-claro border-bottom border-top-0 border-end-0 border-start-0" aria-describedby="emailHelp" onChange={formik.handleChange}
                        value={formik.values.email} />{formik.touched.email && formik.errors.email ? (
                            <div className='text-danger'>{formik.errors.email}</div>
                        ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label texto-amarillo">Password</label>
                    <input type="password" name="password" id="password" className="form-control bg-celeste-claro border-bottom border-top-0 border-end-0 border-start-0" onChange={formik.handleChange}
                        value={formik.values.password} />
                    {formik.touched.password && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
                    ) : null}
                </div>
                <div className="mb-3 form-check">
                </div>
                <button type="submit" className="btn text-white bg-azul-oscuro col-12 mx-auto">Entrar</button>
            </form>
            <div className="container">
                <p id="emailHelp" className="form-text my-3 d-flex justify-content-center">iniciar con Google</p>
                <button type="submit" className="btn borde-azul-oscuro col-12 mx-auto border-2 rounded-pill"><img src={googleLogo} alt=":C" style={{ width: "30px" }} /></button>
            </div>
            <div className="d-flex form-text my-4 justify-content-between container">
                <p id="emailHelp">Olvidaste tu contraseña?</p>
                <Link to={"/signup"}><p className="texto-amarillo">Regístrate</p></Link>
            </div>
        </div>
    );
};