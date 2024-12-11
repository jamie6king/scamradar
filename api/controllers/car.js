function test(req, res) {
    res.status(200).json({ message: "Car route test" });
}

const CarController = {
    test: test,
};

module.exports = CarController;
