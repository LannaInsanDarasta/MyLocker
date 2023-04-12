const { resError, resSuccess } = require("../../services/responseHandler");
const prisma = require("../../prisma/client");
const { generateString } = require("../../services/stringGenerator");
const { getUser } = require("../../services/auth");
const ITEM_LIMIT = 10;

exports.createLockerDevice = async (req, res) => {
    try {
        const lockerCount = await prisma.locker.count(); // menghitung banyak data di db, untuk membuat nama loker
        let lockerName = `Loker-${lockerCount + 1}`;

        const availableLocker = await prisma.locker.findUnique({
            where: { name: lockerName },
        });

        if (availableLocker) {
            // jika nama sudah ada maka tambah 1 angka
            lockerName = `Loker-${lockerCount + 2}`;
        }
        const locker = await prisma.locker.create({
            data: {
                name: lockerName,
            },
        });

        return resSuccess({
            res,
            title: "Success create locker",
            data: locker,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to create locker device",
            errors: error,
        });
    }
};

exports.list = async (req, res) => {
    const { search, cursor } = req.query;
    let deviceList;

    try {
        if (search) {
            if (!cursor) {
                deviceList = await prisma.locker.findMany({
                    where: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: ITEM_LIMIT,
                    select: {
                        name: true,
                        id: true,
                    },
                });
            }

            if (cursor) {
                deviceList = await prisma.locker.findMany({
                    where: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: ITEM_LIMIT,
                    skip: 1,
                    cursor: {
                        id: cursor,
                    },
                    select: {
                        name: true,
                        id: true,
                    },
                });
            }
        }

        if (!search) {
            if (!cursor) {
                deviceList = await prisma.locker.findMany({
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: ITEM_LIMIT,
                    select: {
                        name: true,
                        id: true,
                    },
                });
            }
            if (cursor) {
                deviceList = await prisma.locker.findMany({
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: ITEM_LIMIT,
                    skip: 1,
                    cursor: {
                        id: cursor,
                    },
                    select: {
                        name: true,
                        id: true,
                    },
                });
            }
        }

        return resSuccess({
            res,
            title: "Success list device",
            data: deviceList,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to list locker device",
            errors: error,
        });
    }
};

exports.detail = async (req, res) => {
    const { name } = req.params;
    try {
        const data = await prisma.locker.findUnique({
            where: {
                name,
            },
            select: {
                id: true,
                name: true,
                rent: {
                    select: {
                        timeSchedule: true,
                        maximumCheckInTime: true,
                        status: true,
                        User: {
                            select: {
                                username: true,
                                Card: {
                                    select: {
                                        cardNumber: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return resSuccess({
            res,
            title: "Success get device detail",
            data: data,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to get device list",
            errors: error,
        });
    }
};

exports.startRent = async (req, res) => {
    try {
        const { name, time } = req.body;
        const dateObj = new Date(time);
        const userID = await getUser(req);

        const currentDate = await prisma.rent.findMany({
            where: {
                Locker: {
                    name,
                },
                timeSchedule: {
                    gte: new Date(dateObj.toISOString().split("T")[0]),
                },
            },
        });

        if (currentDate.length > 0) {
            currentDate.forEach((d) => {
                if (
                    d.timeSchedule.toISOString().split("T")[0] ===
                    dateObj.toISOString().split("T")[0]
                )
                    throw "Locker Already Booked For This Day";
            });
        }

        const rentData = await prisma.rent.create({
            data: {
                status: "BOOKED",
                timeSchedule: dateObj,
                maximumCheckInTime: new Date(dateObj.getTime() - 30 * 60000),
                User: {
                    connect: {
                        id: userID,
                    },
                },
                Locker: {
                    connect: {
                        name,
                    },
                },
            },
        });

        return resSuccess({
            res,
            title: "Success update device",
            data: rentData,
        });
    } catch (error) {
        console.log(error);
        return resError({
            res,
            title: "Failed to start rent locker device",
            errors: error,
        });
    }
};

exports.startUseLocker = async (req, res) => {
    try {
        const { name, cardNumber } = req.body;
        let openLockerData;
        let findData;

        const currentDate = new Date(new Date().toISOString().split("T")[0]);

        const datas = await prisma.rent.findMany({
            where: {
                Locker: {
                    name,
                },
                User: {
                    Card: {
                        cardNumber,
                    },
                },
                timeSchedule: {
                    gte: currentDate,
                },
            },
            select: {
                id: true,
                status: true,
                timeSchedule: true,
                maximumCheckInTime: true,
                User: {
                    select: {
                        username: true,
                        Card: {
                            select: {
                                cardNumber: true,
                            },
                        },
                    },
                },
            },
        });

        datas.forEach((data) => {
            if (
                data.timeSchedule.toISOString().split("T")[0] ===
                new Date().toISOString().split("T")[0]
            ) {
                findData = data;
                console.log("CURRENT DATE NOW FOUND");
            }
        });

        if (findData?.User?.Card?.cardNumber !== cardNumber)
            throw "Card Not Match";

        if (
            findData.status !== "USED" &&
            new Date(Date.now()) >= findData.maximumCheckInTime
        ) {
            await prisma.rent.delete({
                where: {
                    id: findData.id,
                },
            });
            throw "Check In time has passed";
        }

        openLockerData = await prisma.rent.update({
            where: {
                id: findData.id,
            },
            data: {
                status: "USED",
            },
        });

        return resSuccess({
            res,
            title: "Success open locker",
            data: openLockerData,
        });
    } catch (error) {
        console.log(error);
        return resError({
            res,
            title: "Failed start using locker",
            errors: error,
        });
    }
};

exports.finishRent = async (req, res) => {
    try {
        // Ketika Pengguna telah selesai menggunakan loker
        const { name } = req.body;
        const currentDate = new Date(new Date().toISOString().split("T")[0]);
        let findData;

        const datas = await prisma.rent.findMany({
            where: {
                Locker: {
                    name,
                },
                timeSchedule: {
                    gte: currentDate,
                },
            },
            select: {
                id: true,
                status: true,
                timeSchedule: true,
                maximumCheckInTime: true,
                User: {
                    select: {
                        username: true,
                        Card: {
                            select: {
                                cardNumber: true,
                            },
                        },
                    },
                },
            },
        });

        datas.forEach((data) => {
            if (
                data.timeSchedule.toISOString().split("T")[0] ===
                new Date().toISOString().split("T")[0]
            ) {
                findData = data;
            }
        });

        const rentData = await prisma.rent.delete({
            where: {
                id: findData.id,
            },
        });

        return resSuccess({
            res,
            title: "Success update device",
            data: rentData,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to finish rent locker device",
            errors: error,
        });
    }
};
