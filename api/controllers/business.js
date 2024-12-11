function test(req, res) {
    res.status(200).json({ message: "Business route test" });
}

const BusinessController = {
    test: test,
};

module.exports = BusinessController;
