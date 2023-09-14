import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

export const UploadImages = () => {
    const { store, actions } = useContext(Context)
    const [files, setFiles] = useState(null);
    const [images, setImages] = useState([])

    const getImages = async () => {
        try {
            const data = await fetch(process.env.BACKEND_URL + "/api/houses/images/2")
            const response = await data.json();
            console.log(response.results);
            setImages(response.results);
        } catch (error) {
            console.log(error);
        }
    }

    const uploadImage = evt => {
        evt.preventDefault();
        console.log("This are the files", files)

        const formData = new FormData();
        formData.append('image', files[0]); // Agrega la imagen al FormData
        formData.append('json_data', JSON.stringify({
            title: "Casa",
            category: "Alquiler",
            description: "asd",
            user_id: 1,
            location: "pa",
            number_of_rooms: 2,
            number_of_bathrooms: 3,
            parking: true,
            wifi: true,
            virified_account: true,
            price: 200
        }));

        const options = {
            body: formData,
            method: "POST",
        }

        try {
            const saveImage = async () => {
                await fetch(process.env.BACKEND_URL + "/api/post", options);
                await getImages();
            }
            saveImage();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getImages();
    }, [])

    return (
        <div className='mt-5'>
            <form onSubmit={uploadImage}>
                <input type="file" onChange={(e) => setFiles(e.target.files)} />
                <button>Upload</button>
            </form>
            <div>
                {images.map(image => <img src={image.url} key={image.id} />)}
            </div>

        </div>
    );
}