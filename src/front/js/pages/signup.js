import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';


function Singup() {
  
  const[coinciden, setCoinciden]=useState(true)
  const { store, actions } = useContext(Context)
  const navigate= useNavigate();
  const confpassword = useRef();

  async function handleSubmit(e) {
    e.preventDefault()
 
  if (password !== confpassword) {
  alert('La contraseña no coincide con la confirmacion')
    
  }
  
}
 
   const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: '',
      phone:"",
      password:"",
      confpassword:"",
      
    },
    validationSchema:
       Yup.object({
      firstName: Yup.string()
        .max(15, 'Debe tener 15 letras o menos')
        .required('Obligatorio'),
      lastName: Yup.string()
        .max(15, 'Debe tener 15 letras o menos')
        .required('Obligatorio'),
        phone:Yup.string()
        .min(9, 'Debe tener 9 caracteres o mas')
        .required('Obligatorio'),
      email: Yup.string().email('Invalid email address').required('Obligatorio'),
      password:Yup.string().min(8,'Debe tener 8 caracteres o mas').required('Obligatorio'),
      confpassword:Yup.string().min(8,'Debe tener 8 caracteres o mas').required('Obligatorio'),
      
            
            
    }),

    onSubmit: values => {
      
      if (values.password !== values.confpassword){
    
        setCoinciden(false)
      }
      else{
      actions.signup(values).then(res=>{
        
        if (res==true)navigate("/login")
      })
    }},
    
    
      
    
  });
  
    

  return (
   
    <form className='container mt-5 bg-white' onSubmit={formik.handleSubmit}>
      <h1 className='d-flex justify-content-start mb-4'>Regístrate</h1>
      <div className=''>
    <div className="mb-3 texto-amarillo">
      <label htmlFor="firstName" className="form-label">Nombre</label>
      <input type="firstName" name="firstName" id="firstName" className="form-control"  aria-describedby="emailHelp" placeholder='Ingresa tu nombre' onChange={formik.handleChange}
         value={formik.values.firstName}/>
         {formik.touched.firstName && formik.errors.firstName ? (
         <div className='text-danger'>{formik.errors.firstName}</div>
       ) : null}
    </div>
    <div className="mb-3 texto-amarillo">
      <label htmlFor="lastName" className="form-label">Apellido</label>
      <input type="lastName" name="lastName" id="lastName" className="form-control"  placeholder='Ingresa tu apellido' onChange={formik.handleChange}
         value={formik.values.lastName}/>{formik.touched.lastName && formik.errors.lastName ? (
          <div className='text-danger'>{formik.errors.lastName}</div>
        ) : null}
    </div>
    <div className="mb-3 texto-amarillo">
      <label htmlFor="email" className="form-label">Email</label>
      <input type="email" name="email" id="email" className="form-control"  placeholder='Ingresa tu email' onChange={formik.handleChange}
         value={formik.values.email}/>{formik.touched.email && formik.errors.email ? (
          <div className='text-danger'>{formik.errors.email}</div>
        ) : null}
    </div>
    <div className="mb-3 texto-amarillo">
      <label htmlFor="phone" className="form-label">Telefono de contacto</label>
      <input type="phone" name="phone" id="phone" className="form-control"  placeholder='Ingresa un telefono de contacto' onChange={formik.handleChange}
         value={formik.values.phone}/>
         {formik.touched.phone && formik.errors.phone ? (
          <div className='text-danger'>{formik.errors.phone}</div>
        ) : null}
    </div>
    <div className="mb-3 texto-amarillo">
      <label htmlFor="password" className="form-label">Contraseña</label>
      <input type="password" name="password" id="password" className="form-control"  placeholder='Ingresa una contraseña'onChange={formik.handleChange}
        value={formik.values.password} />
         {formik.touched.password && formik.errors.password ? (
         <div className='text-danger'>{formik.errors.password}</div>
       ) : null}
    </div>
      <div className="mb-3 texto-amarillo"> 
      <label htmlFor="confpassword" className="form-label">Confirmar contraseña</label>
      <input type="password" ref={confpassword} name="confpassword" id="confpassword" className="form-control"  placeholder='Confrima tu contraseña'onChange={formik.handleChange} />
      {!coinciden && <span className='text-danger'>Las contraseñas no coinciden</span>}
      
         {formik.touched.confpassword && formik.errors.confpassword ? (
         <div className='text-danger'>{formik.errors.confpassword}</div>
       ) : null}
    </div>  
    <button type="submit" className="text-white bg-azul-oscuro d-grid gap-2 col-6 mx-auto">Continuar</button>
    </div>
    <div className= "d-flex justify-content-center mt-4">
      <p>Ya tienes una cuenta?</p> <Link to={"/login"}><p className='texto-amarillo'> Ingresa</p></Link>
    </div>
     <div className="mb-3 form-check d-flex justify-content-center">
    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
    <label className="form-check-label" htmlFor="exampleCheck1">Estoy de acuerdo con los Terminos del Servicio y la Política de Privacidad</label>
    </div>
  </form>
  
  );
}

export default Singup;