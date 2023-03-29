const loginButton = document.getElementById("loginBtn");
const usernameForm = document.getElementById("usernameForm");
const passwordForm = document.getElementById("passwordForm");
loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameValue = usernameForm.value;
    const passwordValue = passwordForm.value;
    const resp = await httpRequest({
        url: "/api/v1/user/login",
        method: "POST",
        body: {
            username: usernameValue,
            password: passwordValue,
        },
    });

    // KALAU LOGIN GAGAL
    if (!resp.success) {
        alert("Username & Password not match");
    }

    // KALAU LOGIN SUKSES
    if (resp.success) {
        window.location = "/";
    }
    console.log(resp);
});
