const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cors())

/**
 * 1️⃣ Paso
 * Crear una aplicacion en Ppaypal
 * Aqui agregamos las credenciales de nuestra app de PAYPAL
 * https://developer.paypal.com/developer/applications (Debemos acceder con nuestra cuenta de Paypal)
 * [Cuentas de TEST] https://developer.paypal.com/developer/accounts/
 */

const CLIENT = 'Ac1lVvrfBsrySxglJDESOMmw9uwh9JinOtpOJxU8YgXNtQ2Gnyv8S2H_PglGGMjIQAJ_o96F7ZhT-pJR';
const SECRET = 'ELMWoF96sdSn59ZUyxP12TFTNDUQohFfCbsn3TwZuO0IsI0rBl5KosinZKF2esc6SSGj3cwBevkf2J7x';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Live https://api-m.paypal.com

const auth = { user: CLIENT, pass: SECRET }

/**
 * Establecemos los contraladores que vamos a usar
 */

const createPayment = (req, res) => {

    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD', //https://developer.paypal.com/docs/api/reference/currency-codes/
                value: '115'
            }
        }],
        application_context: {
            brand_name: `MiTienda.com`,
            landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
            user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
            return_url: `http://localhost:3000/execute-payment`, // Url despues de realizar el pago
            cancel_url: `http://localhost:3000/cancel-payment` // Url despues de realizar el pago
        }
    }
    //https://api-m.sandbox.paypal.com/v2/checkout/orders [POST]

    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
        auth,
        body,
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}

/**
 * Esta funcion captura el dinero REALMENTE
 * @param {*} req 
 * @param {*} res 
 */
const executePayment = (req, res) => {
    const token = req.query.token; //<-----------

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ data: response.body })
    })
}