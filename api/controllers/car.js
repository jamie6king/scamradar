function test(req, res) {
    res.status(200).json({ message: "Car route test" });
}

function carReport(req, res) {
    const registrationNumber = req.body.registrationNumber;
    if (!registrationNumber) {
        res.status(400).json({
            message:
                "Couldn't find registrationNumber, did you send this in the request body?",
        });
    }
    res.status(200).json({
        message: "Great success!!!!",
    });
}

const CarController = {
    test: test,
    carReport: carReport,
};

module.exports = CarController;
