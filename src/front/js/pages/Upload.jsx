import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadImages } from '../component/UploadImages.jsx';
import { Context } from "../store/appContext";

export const Upload = () => {
    const { store, actions } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        if (store.auth === false) navigate("/");
    }, []);

    return (
        <UploadImages />
    );
}