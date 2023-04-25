const usernameForm = document.getElementById("nama");
const idKartuForm = document.getElementById("idKartu");
const nomorHandphoneForm = document.getElementById("noHandphone");
const emailForm = document.getElementById("E-mail");
const historyContainer = document.querySelector(".history-container");
const showMoreBtn = document.getElementById("showMore");
const fetchData = async () => {
    const resp = await httpRequest({
        url: "/api/v1/user/",
        method: "GET",
    });

    usernameForm.value = resp.data.username;
    idKartuForm.value = resp.data?.Card.cardNumber;
    nomorHandphoneForm.value = resp.data.noHandphone;
    emailForm.value = resp.data.email;
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
        console.log(d);
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
