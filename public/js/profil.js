const usernameForm = document.getElementById("nama");
const idKartuForm = document.getElementById("idKartu");
const nomorHandphoneForm = document.getElementById("noHandphone");
const emailForm = document.getElementById("E-mail");
const historyContainer = document.querySelector(".history-container");
const rentContainer = document.querySelector(".rent-container");
const showMoreBtn = document.getElementById("showMore");
const registerContainer = document.getElementById("register-container");
const tokenButton = document.getElementById("token-button");
const tokenContainer = document.getElementById("token-container");
const maximumToken = document.getElementById("maximum-token");
const token = document.getElementById("token");

// Basic Loader
const fetchData = async () => {
    const resp = await httpRequest({
        url: "/api/v1/user/",
        method: "GET",
    });

    usernameForm.value = resp.data.username;
    idKartuForm.value = resp.data?.Card?.cardNumber || "Belum Memiliki Kartu";
    nomorHandphoneForm.value = resp.data.noHandphone;
    emailForm.value = resp.data.email;
    if (resp.data?.Card?.cardNumber === undefined) {
        registerContainer.classList.remove("hidden");
    }

    if (resp.data?.token) {
        tokenButton.classList.add("hidden");
        tokenContainer.classList.remove("hidden");
        maximumToken.textContent = times(resp.data.tokenExpiredAt);
        token.textContent = resp.data.token;
    }
};

fetchData();

// GET HISTORY
const historyTemplate = (data) => {
    return `
        <div class="history-template d-flex justify-content-between" data-id="${
            data.id
        }">
            <p class="history-item text-secondary-color-3 my-2">${
                data.locker
            }</p>
            <p class="history-item text-secondary-color-3 my-2">${
                data.cardNumber
            }</p>
            <p class="history-item text-secondary-color-3 my-2">${days(
                data.timeSchedule
            )}</p>
        </div>
    `;
};
const historyLoader = (data) => {
    data.forEach((d) => {
        historyContainer.insertAdjacentHTML("beforeend", historyTemplate(d));
    });
};
generalDataLoader({ url: "/api/v1/locker/rent/history", func: historyLoader });

showMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cursor = lastCursorFinder("history-template", "data-id");
    generalDataLoader({
        url: `/api/v1/locker/rent/history?cursor=${cursor}`,
        func: historyLoader,
    });
});

// GET USER RENT LIST
const rentTemplate = (data) => {
    return `
        <div class="history-template d-flex justify-content-between" data-id="${
            data.id
        }">
            <p class="history-item text-secondary-color-3 my-2">${
                data.Locker.name
            }</p>
            <p class="history-item text-secondary-color-3 my-2">${
                data.User.Card.cardNumber
            }</p>
            <p class="history-item text-secondary-color-3 my-2">${days(
                data.maximumCheckInTime
            )}</p>
        </div>
    `;
};
const rentLoader = (data) => {
    data.forEach((d) => {
        rentContainer.insertAdjacentHTML("beforeend", rentTemplate(d));
    });
};
generalDataLoader({
    url: "/api/v1/locker/rent/user-list",
    func: rentLoader,
});

// REGISTER CARD
tokenButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await httpRequest({
        url: "/api/v1/locker/card/generate-token",
        method: "POST",
    });

    if (resp.success) {
        tokenButton.classList.add("hidden");
        tokenContainer.classList.remove("hidden");
        maximumToken.textContent = times(resp.data.tokenExpiredAt);
        token.textContent = resp.data.token;
    }

    if (!resp.success) {
        alert(`${resp.message}, ${resp.errors}`);
    }
});
