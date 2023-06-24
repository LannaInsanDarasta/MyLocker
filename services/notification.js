const axios = require("axios");
async function sendWhatsappNotification({ url, body = null, method = "POST" }) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.WHATSAPP_SECRET,
        },
        method,
        data: body,
        url,
        redirect: "follow",
    };

    const response = await axios(config);
    console.log(response.data);
    return response.data;
}

module.exports = { sendWhatsappNotification };
