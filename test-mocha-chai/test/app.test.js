import { expect } from "chai";
import { calcArea, calcPerimeter, isSquare } from "../src/app.js";

describe("Testing the Geometry Functions", function () {
  it("1. Calculate the area of the rectangle", function (done) {
    expect(calcArea(3, 4)).to.equal(12);
    done();
  });

  it("2. Calculate the perimeter of the rectangle", function (done) {
    expect(calcPerimeter(5, 7)).to.equal(24);
    done();
  });

  it("3. Check if a shape is a square", function (done) {
    expect(isSquare(6, 6)).to.be.true;
    expect(isSquare(6, 10)).to.be.false;
    done();
  });

  it("4. Handles zero dimension", function (done) {
    expect(calcArea(0, 5)).to.equal(0);
    expect(calcPerimeter(0, 5)).to.equal(10);
    done();
  });

  it("5. Handles decimals", function (done) {
    expect(calcArea(2.5, 4)).to.equal(10);
    expect(calcPerimeter(2.5, 4)).to.equal(13);
    done();
  });
});
