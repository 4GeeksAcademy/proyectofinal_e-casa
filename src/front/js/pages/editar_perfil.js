import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import diego from "../../img/diego.jpg";
import { CardFeedAlq } from "../component/card_feed_alq.jsx"
import { CardFeedVen } from "../component/card_feed_ven.jsx"
import { useFormik } from 'formik';
import * as Yup from 'yup';


function Editarperfil() {
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confpassword, setConfpassword] = useState("")
    const [login, setLogin] = useState("show active")
    const [loginST, setLoginST] = useState("active")
    const [register, setRegister] = useState("")
    const [registerST, setRegisterST] = useState("")
    const [description, setDescription] = useState("")

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();
    let casasVentas = []
    let casasAlquiler = []


    async function handleSubmit(e) {
        e.preventDefault()

    }

    const formik = useFormik({
        initialValues: {
            name: store.perfil.name,
            lastname: store.perfil.lastname,
            phoneNumber: store.perfil.phoneNumber,
            password: store.perfil.password,
            description:store.perfil.description

        },
        validationSchema:
            Yup.object({
                name: Yup.string()
                    .min(1, 'No debe estar vacío')
                ,
                lastname: Yup.string()
                    .min(1, 'No debe estar vacío')
                ,
                phoneNumber: Yup.string()
                    .min(9, 'Debe tener 9 caracteres o mas'),

                password: Yup.string().min(8, 'Debe tener 8 caracteres o mas'),
                description:Yup.string().min(8,"Debe tener 8 caracteres o mas")


            }),

        onSubmit: values => {   
            console.log(values);
            actions.editPerfil(values).then(res => {

                if (res.msg == "Tu perfil fue editado con éxito")
                    navigate("/perfil")

            }
            )
        }});



    return (

        <form className='container pb-3 bg-celeste-claro mt-5' onSubmit={formik.handleSubmit}>
            <Link to={"/perfil"}><button  className="btn text-white bg-azul-oscuro  rounded-pill  my-4"><i className="fa-solid fa-xmark"></i></button></Link>

            <div className='ms-3 d-flex  justify-content-center me-4'>




                <div className=' justify-content-center'>
                    <img src={store.perfil.profile_picture} style={{ width: "100px", height: "100px" }} className="rounded-circle " alt="..." />
                    <strong><p className='m-auto'>{store.perfil.name}</p></strong>
                    <strong><p className='registro'>{store.perfil.email}</p></strong>


                </div>


            </div>





            <div className=''>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="name" className="form-label">Nombre </label>
                    <input type="name" id="name" name="name" className="form-control" aria-describedby="emailHelp" onChange={formik.handleChange}
                        value={formik.values.name} />
                    {formik.touched.name && formik.errors.name ? (
                        <div className='text-danger'>{formik.errors.name}</div>
                    ) : null}
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="lastname" className="form-label">Apellido </label>
                    <input type="lastname" id="lastname" name="lastname" className="form-control" onChange={formik.handleChange}
                        value={formik.values.lastname} />{formik.touched.lastname && formik.errors.lastname ? (
                            <div className='text-danger'>{formik.errors.lastname}</div>
                        ) : null}
                </div>

                <div className="mb-3 texto-amarillo">
                    <label htmlFor="phoneNumber" className="form-label">Telefono de contacto </label>
                    <input type="phoneNumber" id="phoneNumber" name="phoneNumber" className="form-control" onChange={formik.handleChange}
                        value={formik.values.phoneNumber} />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className='text-danger'>{formik.errors.phoneNumber}</div>
                    ) : null}
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input type="password" id="password" name="password" className="form-control" onChange={formik.handleChange}
                        value={formik.values.password} />
                    {formik.touched.password && formik.errors.password ? (
                        <div className='text-danger'>{formik.errors.password}</div>
                    ) : null}
                </div>

                <div className="mb-3 texto-amarillo">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <input type="description"id="description" name="description" className="form-control"onChange={formik.handleChange}
                        value={formik.values.description} />
                    {formik.touched.description && formik.errors.description ? (
                        <div className='text-danger'>{formik.errors.description}</div>
                    ) : null}
                </div>
                <button className="btn text-white bg-azul-oscuro" type='submit' >Confirmar</button>
            </div>


            {/* <div className="text-white my-5">
            
            <ul className="nav-container nav nav-pills nav-justified mt-5" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                    <h2 className={"nav-link " + loginST} id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
                        aria-controls="pills-login" aria-selected="true" onClick={() => alquileres()}>Alquileres</h2>
                </li>
                <li className="nav-item" role="presentation">
                    <h2 className={"nav-link " + registerST} id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
                        aria-controls="pills-register" aria-selected="false" onClick={() => ventas()}>Ventas</h2>
                </li>
            </ul>
            <div className="tab-content container-alquileres">
                <div className={"tab-pane fade " + login}>
                    <div className={"row"} id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        {store.casaPropietario.map((item, index) => {
                            return (
                                item.category=="Alquiler"?
                                <CardFeedAlq key={index} ubicacion={item.location} precio={item.price} id={item.id} imageUrl={item.image_url} />
                            :null)
                        })}
                    </div>
                </div>
                <div className={"tab-pane fade" + register}>
                    <div className={"row"} id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                        {store.casaPropietario.map((item, index) => {
                            return (
                            item.category=="Venta"?
                                <CardFeedVen key={index} ubicacion={item.location} precio={item.price} id={item.id} imageUrl={item.image_url}  />
                            : null)
                        })}
                    </div>
                </div>
            </div>
            
        </div> */}






        </form>

    );
}

export default Editarperfil;