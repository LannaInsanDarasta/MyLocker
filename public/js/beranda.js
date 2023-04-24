const container = document.getElementById("container");
const loadMoreBtn = document.querySelector("#show-more");

const template = (data) => {
    let textColor = null;
    if (data.rentStatus === "Tersedia Untuk Hari Ini")
        textColor = "text-main-color-2";

    if (data.rentStatus.startsWith("Tidak Tersedia"))
        textColor = "text-warning";

    if (data.rentStatus.startsWith("Tidak Tersedia, Sudah Digunakan Saat Ini"))
        textColor = "text-danger";

    return `
    <div class="boxs" data-id="${data.id}">
        <img src="/image/gambar_loker.png" alt="Gamber Loker" />
        <a class="pointer" href="/status/${data.name
            .replace(" ", "-")
            .toLowerCase()}">${data.name}</a>
        <h4 class="${textColor} text-wrap">${data.rentStatus}</h4>
    </div>
    `;
};
const listLoader = (datas) => {
    datas.forEach((data) => {
        container.insertAdjacentHTML("beforeend", template(data));
    });
};

loadMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cursor = lastCursorFinder("boxs", "data-id");
    generalDataLoader({
        url: `/api/v1/locker/?cursor=${cursor}`,
        func: listLoader,
    });
});

generalDataLoader({ url: "/api/v1/locker/", func: listLoader });
