const mongoose = require("mongoose");
const { connectToDatabase } = require("../db/db");

describe("testing the database connection", () => {
    beforeEach(() => {
        process.env.NODE_ENV = "development";
    });

    it("connects successfully", async () => {
        const logSpy = jest.spyOn(console, "log");

        await connectToDatabase();

        expect(logSpy).toHaveBeenCalledWith(
            "Successfully connected to MongoDB"
        );

        await mongoose.connection.close();
    });

    it("throws error when no connection string provided", async () => {
        process.env.MONGODB_URL = "";

        try {
            await connectToDatabase();
        } catch (err) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(err.message).toBe("No connection string provided");
        }
    });
});
