const loginButton = document.getElementById("daftar");
const usernameForm = document.getElementById("namaPengguna");
const noHandphoneForm = document.getElementById("noHandphone");
const emailForm = document.getElementById("E-mail");
const passwordForm = document.getElementById("kataSandi");

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameValue = usernameForm.value;
    const passwordValue = passwordForm.value;
    const noHandphoneValue = noHandphoneForm.value;
    const emailValue = emailForm.value;

    const resp = await httpRequest({
        url: "/api/v1/user/register",
        method: "POST",
        body: {
            username: usernameValue,
            password: passwordValue,
            noHandphone: noHandphoneValue,
            email: emailValue,
        },
    });

    // KALAU LOGIN GAGAL
    if (!resp.success) {
        alert("failed to register");
    }

    // KALAU LOGIN SUKSES
    if (resp.success) {
        window.location = "/";
    }
    console.log(resp);
});
