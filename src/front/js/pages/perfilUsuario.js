import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import diego from "../../img/diego.jpg";


function Perfil() {
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confpassword, setConfpassword] = useState("")
    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    
    async function handleSubmit() {
        // e.preventDefault()
    
    }
    useEffect(() => {
            
        actions.getPerfil()
        }, [])


    return (
    
        <form className='container mt-5' onSubmit={handleSubmit}>
            <Link to={"/"}><button type="submit" className="btn text-white bg-azul-oscuro  rounded-pill  my-4"><i class="fa-solid fa-xmark"></i></button></Link>

            <div className='ms-3 d-flex  justify-content-center me-4'>




                <div className=' justify-content-center'>
                    <img src={diego} style={{ width: "100px", height: "100px" }} className="rounded-circle " alt="..." />
                    <p className='m-auto'>{store.perfil.name}</p>
                    <p className='registro'>{store.perfil.email}</p>

                    
                </div>

                <div className='ms-3   justify-content-center mt-5'>
                    <li className="list-group-item duenio">
                        <Link to={"/"}><i className="fa-regular fa-heart"></i></Link><br/>
                        <Link to={"/"}><i className="fa-solid fa-gears my-3"></i></Link>
                    </li>
                </div>
            </div>





            <div className=''>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputEmail1" className="form-label">Nombre <i className="fa-solid fa-pencil" onClick={()=>setFirstName("")}></i> </label>
                    <input type="nombre" className="form-control" disabled aria-describedby="emailHelp" value={store.perfil.name} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputPassword1" className="form-label">Apellido <i className="fa-solid fa-pencil"></i></label>
                    <input type="apellido" className="form-control" disabled value={store.perfil.lastname} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputPassword1" className="form-label">Email <i className="fa-solid fa-pencil"></i></label>
                    <input type="email" className="form-control" disabled value={store.perfil.email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputPassword1" className="form-label">Telefono de contacto <i className="fa-solid fa-pencil"></i></label>
                    <input type="contacto" className="form-control" disabled value={store.perfil.phoneNumber} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña <i className="fa-solid fa-pencil"></i> <i className="fa-regular fa-eye"></i></label>
                    <input type="password" className="form-control" disabled value={store.perfil.password}  onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3 texto-amarillo">
                    <label htmlFor="exampleInputPassword1" className="form-label">Descripción <i className="fa-solid fa-pencil"></i></label>
                    <input type="text" className="form-control" disabled value='Descripcion' onChange={(e) => setConfpassword(e.target.value)} />
                </div>
                <button type="submit" className="text-white btn btn-danger d-grid gap-2 col-6 mx-auto">Eliminar cuenta</button>
            </div>

        </form>

    );
}

export default Perfil;