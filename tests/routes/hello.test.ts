import request from "supertest";
import app from "../../src/app";

describe("Hello Route", () => {
    describe("GET /hello", () => {
        it("should return hello message with status 200", async () => {
            const response = await request(app).get("/hello").expect("Content-Type", /json/).expect(200);

            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toBe("Hello from Express + TypeScript!");
        });

        it("should return JSON format", async () => {
            const response = await request(app).get("/hello");

            expect(response.headers["content-type"]).toMatch(/json/);
            expect(response.body).toBeInstanceOf(Object);
        });
    });
});
