const prisma = require("../prisma/client");
const { resError } = require("../services/responseHandler");

const deviceIsExist = async (req, res, next) => {
    const name = req.params.name || req.body.name || req.query.name;

    try {
        const data = await prisma.locker.findUnique({
            where: {
                name,
            },
        });
        if (data === null) throw "Device Not Exist";
        return next();
    } catch (error) {
        return resError({
            res,
            title: "Device Not Exist",
            errors: error,
        });
    }
};

const deviceIsNotUse = async (req, res, next) => {
    const name = req.params.name || req.body.name || req.query.name;

    try {
        const data = await prisma.locker.findUnique({
            where: {
                name,
            },
            select: {
                rent: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (data.rent.status === "BOOKED" || data.rent.status === "USED")
            throw "Device Currently Use";
        return next();
    } catch (error) {
        return resError({
            res,
            title: "Cant Start Rent Locker",
            errors: error,
        });
    }
};

const deviceIsUse = async (req, res, next) => {
    const name = req.params.name || req.body.name || req.query.name;

    try {
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

        if (!findData) throw "Device Rent Not Found";

        if (!(findData.status === "USED"))
            throw "Device Rent Session Not Start Yet";

        return next();
    } catch (error) {
        return resError({
            res,
            title: "Cant Finsih Rent Locker",
            errors: error,
        });
    }
};

const deviceIsBooked = async (req, res, next) => {
    const name = req.params.name || req.body.name || req.query.name;

    try {
        const data = await prisma.locker.findUnique({
            where: {
                name,
            },
            select: {
                rent: {
                    select: {
                        status: true,
                    },
                },
            },
        });
        if (!(data.rent.status === "BOOKED")) throw "Device Not Booked Yet";
        return next();
    } catch (error) {
        return resError({
            res,
            title: "Cant Use Rent Locker",
            errors: error,
        });
    }
};

module.exports = { deviceIsExist, deviceIsNotUse, deviceIsUse, deviceIsBooked };
