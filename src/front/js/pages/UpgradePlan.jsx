import React, { useEffect, useContext } from 'react';
import { UpgradePlanCard } from '../component/UpgradePlanCard.jsx';
import { Context } from "../store/appContext";

export const UpgradePlan = () => {
    const { store, actions } = useContext(Context);
    
    return (
        <div className="container mx-auto" style={{ marginTop: "140px" }}>
            <h4 className="d-block fw-bold text-center mb-5">¡Selecciona un plan para aumentar la visibilidad de tu publicación!</h4>
            <div className="row justify-content-between">
                <UpgradePlanCard
                    typeOfPlan="Starter"
                    priceAMonth={10}
                    benefit1="Mayor visibilidad (7 dias)"
                    benefit2="Publica hasta 10 fotos"
                    benefit3="Soporte por correo electronico"
                    planValue={1}
                />
                <UpgradePlanCard
                    typeOfPlan="Pro"
                    priceAMonth={20}
                    benefit1="Mayor visibilidad (1 mes)"
                    benefit2="Publica hasta 15 fotos"
                    benefit3="Soporte por correo electronico"
                    planValue={2}
                />
            </div>
        </div>
    );
}