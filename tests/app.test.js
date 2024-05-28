const request = require("supertest");
const api = require("..//api-gateway/src/index");

describe("GET /", function () {
  it('response with text "API Gateway is running"', async function () {
    const chai = await import("chai");
    const expect = chai.expect;

    await request(app)
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).to.equal("API Gateway is running");
      });
  });
});
