import request from "supertest";
import app from "../../src/app";

describe("Index Route", () => {
    describe("GET /", () => {
        it("should return HTML page with status 200", async () => {
            const response = await request(app).get("/").expect("Content-Type", /html/).expect(200);

            expect(response.text).toContain("Welcome to HIDB Back");
            expect(response.text).toContain("<title>HIDB Back</title>");
        });

        it("should return valid HTML structure", async () => {
            const response = await request(app).get("/");

            expect(response.text).toContain("<html>");
            expect(response.text).toContain("</html>");
            expect(response.text).toContain("<body");
            expect(response.text).toContain("</body>");
        });
    });
});
