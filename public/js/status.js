const bookedListContainer = document.getElementById("status-container");
const currentlyInUse = document.getElementById("currently-in-use");
const availableForBook = document.getElementById("available-for-book");
const bookedAtThisTime = document.getElementById("booked-at-this-time");
const bookingButton = document.getElementById("booking-button");
const finishRentButtton = document.getElementById("finish-rent");
const bookingDateForm = document.getElementById("booking-time");
const usernameForm = document.getElementById("username-form");
const usedBefore = document.getElementById("used-before");

const lockerName = document
    .getElementById("locker-name")
    .getAttribute("data-name")
    .replace(" ", "-");

const bookedTemplate = (data, color) => {
    return `
        <p class="d-block ${color} mb-2 fst-italic status-box">${data} </p>
    `;
};

const basicInformationLoader = (data) => {
    // Ambil hanya tanggal peminjaman saja dari database
    const rentDate = data.rent.map((d) => {
        const rentDateObj = new Date(d.timeSchedule); // ubah data menjadi objek waktu
        const dateOnly = rentDateObj.toISOString().split("T")[0]; // hanya ambil tanggalnya saja
        return dateOnly;
    });

    // Lakukan Looping Mulai Dari Hari Ini Hingga 5 Hari Kedepan
    const startDate = new Date();
    const finishDate = new Date(new Date().setDate(startDate.getDate() + 5));
    let index = 0;
    let isAvailableForToday = false;
    let isBookedForToday = false;
    let isUsedByUser = false;
    for (
        let day = new Date();
        day < finishDate;
        day.setDate(day.getDate() + 1)
    ) {
        // Lakukan Pengecekan Apakah Hari Ini Sudah Dipesan
        const currentLoopDate = day.toISOString().split("T")[0];
        if (rentDate.includes(currentLoopDate)) {
            // INDEX FINDER
            index = rentDate.indexOf(currentLoopDate);
            // Jika Loker Sudah Dipesan
            if (data.rent[index]?.status === "BOOKED") {
                bookedListContainer.insertAdjacentHTML(
                    "beforeend",
                    bookedTemplate(
                        `Dipesan pada ${currentLoopDate}`,
                        "bg-warning"
                    )
                );
                // Cek apakah tanggal penggunaan sama dengan tanggal hari ini
                if (
                    new Date().toISOString().split("T")[0] ===
                    day.toISOString().split("T")[0]
                ) {
                    // Cek Apakah User yang sedang menggunakan loker sama dengan yang login, jika sama maka render tombol selesai
                    if (usernameForm.value === data.rent[index].User.username) {
                        bookedAtThisTime.classList.remove("hidden");
                        availableForBook.classList.add("hidden"); // user tidak bisa memesan loker lagi ketika masih menggunakan loker
                        usedBefore.textContent =
                            days(data.rent[index].maximumCheckInTime).replace(
                                "pukul",
                                "Pukul"
                            ) + " WIB";
                    }
                }
            }

            // Jika Loker Sedang Digunakan
            if (data.rent[index]?.status === "USED") {
                // Cek apakah tanggal penggunaan sama dengan tanggal hari ini
                if (
                    new Date().toISOString().split("T")[0] ===
                    day.toISOString().split("T")[0]
                ) {
                    // Cek Apakah User yang sedang menggunakan loker sama dengan yang login, jika sama maka render tombol selesai
                    if (usernameForm.value === data.rent[index].User.username) {
                        currentlyInUse.classList.remove("hidden");
                        availableForBook.classList.add("hidden"); // user tidak bisa memesan loker lagi ketika masih menggunakan loker
                    }
                }
                bookedListContainer.insertAdjacentHTML(
                    "beforeend",
                    bookedTemplate(
                        `Digunakan pada ${currentLoopDate}`,
                        "bg-danger"
                    )
                );
            }
        }

        // Jike Belum Dipesan berarti loker masih bisa digunakan hari ini
        if (!rentDate.includes(day.toISOString().split("T")[0])) {
            bookedListContainer.insertAdjacentHTML(
                "beforeend",
                bookedTemplate(
                    `Tersedia pada ${currentLoopDate}`,
                    "bg-main-color-3"
                )
            );

            // Lakukan Pengecekan Apakah Loker tersedia Hari ini, jika tersedia tampilkan tombol untuk memesan
            if (
                new Date().toISOString().split("T")[0] ===
                day.toISOString().split("T")[0]
            ) {
                isAvailableForToday = true;
            }
        }
    }

    // Render tombol booking jika terdapat loker yang tersedia hari ini
    if (isAvailableForToday) {
        // availableForBook.classList.remove("hidden");
    }
};

generalDataLoader({
    url: `/api/v1/locker/detail/${lockerName}`,
    func: basicInformationLoader,
});

bookingButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    if (new Date(bookingDateForm.value) >= currentDate) {
        const resp = await httpRequest({
            url: "/api/v1/locker/rent/start",
            body: {
                name: lockerName,
                time: `${bookingDateForm.value}:00`,
            },
        });

        if (resp.success) {
            alert("Berhasil Memesan Loker");
        }

        if (!resp.success) {
            alert(`${resp.message}, ${resp.errors}`);
        }
    } else {
        alert("Tanggal Booking Tidak Valid");
    }
});

finishRentButtton.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await httpRequest({
        url: "/api/v1/locker/rent/finish",
        body: {
            name: lockerName,
        },
    });

    if (resp.success) {
        alert("Berhasil Menyelesaikan Penggunaan Loker");
    }

    if (!resp.success) {
        alert(`${resp.message}, ${resp.errors}`);
    }
});
