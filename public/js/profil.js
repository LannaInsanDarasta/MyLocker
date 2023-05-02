const usernameForm = document.getElementById("nama");
const idPenggunaForm = document.getElementById("idPengguna");
const nomorHandphoneForm = document.getElementById("noHandphone")
const emailForm = document.getElementById("E-mail");

const fetchData = async () => {
    // const usernameValue = usernameForm.value;
    // const idPenggunaValue = idPenggunaForm.value;
    // const noHandphoneValue = nomorHandphoneForm.value;
    // const emailValue = emailForm.value;

    const resp = await httpRequest({
        url: "/api/v1/user/",
        method: "GET",
    });

    console.log(resp);
    console.log(resp.data.email)
    usernameForm.value= resp.data.username;
    idPenggunaForm.value= resp.data.idPengguna;
    nomorHandphoneForm.value= resp.data.noHandphone;
    emailForm.value= resp.data.email;
    
}

fetchData()