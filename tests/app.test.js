const request = require("supertest");
const app = require("..//app");

describe("GET /", function () {
  it('response with text "Hello Inventory!"', async function () {
    const chai = await import("chai");
    const expect = chai.expect;

    await request(app)
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).to.equal("Hello Inventory!");
      });
  });
});
