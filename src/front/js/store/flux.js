
import axios from "axios";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			// message: null,
			// demo: [
			// 	{
			// 		title: "FIRST",
			// 		background: "white",
			// 		initial: "white"
			// 	},
			// 	{
			// 		title: "SECOND",
			// 		background: "white",
			// 		initial: "white"
			// 	}
			// ]
			propietario: [],
			alquileres: [],
			filterRent: [],
			filterSales: [],
			ventas: [],
			casa: {
				"category": "Venta",
				"description": "Melo",
				"id": 18,
				"image_url": "https://res.cloudinary.com/dslz0zdlc/image/upload/v1694873945/aoteeureorya8aioyhkm.webp",
				"location": "Melo, Cerro Largo",
				"numberOfBathrooms": 2,
				"numberOfRooms": 1,
				"parking": true,
				"price": 20000,
				"title": "Melo",
				"user_id": 1,
				"virified_account": true,
				"wifi": false
			},
			auth: false,
			perfil: {},
			favoritos: [],
			casaPropietario: [],
		},
		actions: {

			// exampleFunction: () => {
			// 	getActions().changeColor(0, "green");
			// },

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					// console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},


			signup: async ({firstName, lastName, email, password, phone, confpassword}) => {

				try {
					let data = await axios.post(process.env.BACKEND_URL + "/api/signup", {
						"name": firstName,
						"lastname": lastName,
						"email": email,
						"phone_number": phone,
						"password": password,
						"is_admin": false
					})

					return true;

				} catch (error) {

					if (error.response.status === 404) {
						alert(error.response.data.msg)

					}
					return false;
				}

			},
			validToken: async () => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/valid_token',
						{
							headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
						})
					setStore({ auth: true })
					console.log(data);
					return true
				} catch (error) {
					console.log(error);
					// if (error.response.status === 404) {
					// 	alert(error.response.data.msj)
					// }
					return false
				}
			},
			getPerfil: async () => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/perfil',

						{
							headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
						})
					setStore({ perfil: data.data })
					console.log(getStore().perfil);

					return true
				} catch (error) {
					console.log(error);
					// if (error.response.status === 404) {
					// 	alert(error.response.data.msj)
					// }
					return false
				}
			},

			login: async ({email, password}) => {
				try {
					let data = await axios.post(process.env.BACKEND_URL + '/api/login',
						{
							"email": email,
							"password": password
						})
					console.log(data);
					localStorage.setItem("token", data.data.access_token)
					localStorage.setItem("user_id", data.data.user.id)
					setStore({ perfil: data.data.user });
					setStore({ auth: true })
					return true
				} catch (error) {
					console.log(error);
					// if (error.response.status === 404) {
					// 	alert(error.response.data.msg)
					// }
					return false
				}
			},
			logout: async () => {
				localStorage.removeItem('token')
				setStore({ perfil: {} })
				setStore({ auth: false })
			},
			getAlquileres: async () => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/gethouses/rent')

					const orderByPriority = data.data.results.sort((a, b) => {
						if (b.priority > a.priority) {
							return 1;
						} else if (b.priority < a.priority) {
							return -1;
						}
						return 0;
					})
					setStore({ alquileres: orderByPriority });
					setStore({ orderRentItems: data.data.results });
					console.log(data.data.results);
				} catch (error) {
					console.log(error);
					// if (error.response.status === 404) {
					// 	alert(error.response.data.msj)
					// }
					return false
				}
			},
			getVentas: async () => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/gethouses/sell')
					const orderByPriority = data.data.results.sort((a, b) => {
						if (b.priority > a.priority) {
							return 1;
						} else if (b.priority < a.priority) {
							return -1;
						}
						return 0;
					})
					setStore({ ventas: orderByPriority });
					setStore({ orderSellItems: data.data.results });
					return true;
				} catch (error) {
					console.log(error);
					return false;
				}
			},
			filterRentByPrice: (minPriceSlider, maxPriceSlider) => {
				const rentalFiltered = getStore().alquileres.filter(item => (
					item.price > minPriceSlider && item.price < maxPriceSlider && item
				))

				const orderSalesByPrice = rentalFiltered.sort((a, b) => {
					if (a.price > b.price ) {
						return 1;
					} else if (a.price < b.price ) {
						return -1;
					}
					return 0;
				})
				setStore({ filterRent: orderSalesByPrice });
			},
			filterSalesByPrice: (minPriceSlider, maxPriceSlider) => {
				const salesFiltered = getStore().ventas.filter(item => (
					item.price > minPriceSlider && item.price < maxPriceSlider && item
				))

				const orderSalesByPrice = salesFiltered.sort((a, b) => {
					if (a.price > b.price ) {
						return 1;
					} else if (a.price < b.price ) {
						return -1;
					}
					return 0;
				})
				setStore({ filterSales: orderSalesByPrice });
			},
			getDetalles: async (id) => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/gethouse/' + id)
					setStore({ casa: data.data.results });
					// setStore({propietraio2: data.data.results.info_propietario})
					console.log(data.data.results);

				} catch (error) {
					console.log(error);
					// if (error.response.status === 404) {
					// 	alert(error.response.data.msj)
					// }
					return false
				}
			},
			getFavoritos: async () => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/usuario/favorito',
						{
							headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
						})
					console.log(data.data.results);
					setStore({ "favoritos": data.data.results })

				} catch (error) {
					console.log(error.response);
					// if (error.response.status === 404) {
					setStore({ "favoritos": error.response.data.msg })
					// }
					return false

				}

			},
			getPerfilProp: async (id) => {
				console.log(id);
				if (id) {
					localStorage.setItem("prop_id", getStore().casa.info_propietario?.user_id)
				}

				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/user/' + localStorage.getItem('prop_id'))
					setStore({ propietario: data.data.results });
					console.log(data);
				} catch (error) {
					console.log(error);

					return false
				}

			},
			getCasasProp: async (id) => {
				try {
					let data = await axios.get(process.env.BACKEND_URL + '/api/user/houses/' + id)
					setStore({ casaPropietario: data.data.results });
					console.log(data);
				} catch (error) {
					console.log(error);

					return false
				}

			},
			deleteFavoritos: async (casa_id) => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + '/api/favoritos/house/' + casa_id, {
						method: "DELETE",
						headers: {
							"Authorization": "Bearer " + localStorage.getItem('token')
						}
					});
					const data = await resp.json()
					console.log(data);
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			editPerfil: async ({name, lastname, password, phoneNumber, description}) => {
				console.log(localStorage.getItem('token'));
				
				try {

					const resp = await fetch(process.env.BACKEND_URL + '/api/user', {
						method: "PUT",
						headers: {
							"Authorization": "Bearer " + localStorage.getItem('token')
						},
						body: JSON.stringify({
							
							"name": name,
							"lastname": lastname,
							"phone_number": phoneNumber,
							"password": password,
							"description": description


						})
					})
					const data = await resp.json()

					return data;
				} catch (error) {
					// console.log("Error loading message from backend", error)
				}
			},
			deleteCuenta: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/user", {
						method: "DELETE",
						headers: {
							"Authorization": "Bearer " + localStorage.getItem('token')
						}
					});
					const data = await resp.json()
					console.log(data);
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},



		}
	}
};


export default getState;
