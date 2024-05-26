const request = require("supertest");
const app = require("..//src//index");

describe("GET /", function () {
  it('response with text "Inventory user service!"', async function () {
    const chai = await import("chai");
    const expect = chai.expect;

    await request(app)
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.text).to.equal("Inventory user service !");
      });
  });
});
