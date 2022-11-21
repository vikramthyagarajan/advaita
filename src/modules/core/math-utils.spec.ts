import { inBounds } from "./math-utils";

describe("Math Utils", () => {
  describe("inBounds", () => {
    it("should check for full overlap", () => {
      expect(
        inBounds(
          { left: 0, top: 0, width: 1000, height: 1000 },
          { left: 50, top: 50, height: 50, width: 50 }
        )
      ).toBeTruthy();
      expect(
        inBounds(
          { left: 50, top: 50, height: 50, width: 50 },
          { left: 0, top: 0, width: 1000, height: 1000 }
        )
      ).toBeTruthy();
    });

    it("should check for partial right overlap", () => {
      expect(
        inBounds(
          { left: 0, top: 0, width: 1000, height: 1000 },
          { left: 500, top: 500, height: 200, width: 1000 }
        )
      ).toBeTruthy();
      expect(
        inBounds(
          { left: 500, top: 500, height: 200, width: 1000 },
          { left: 0, top: 0, width: 1000, height: 1000 }
        )
      ).toBeTruthy();
    });

    it("should check for partial top overlap", () => {
      expect(
        inBounds(
          { left: 0, top: 0, width: 1000, height: 1000 },
          { left: 500, top: -100, height: 500, width: 200 }
        )
      ).toBeTruthy();
      expect(
        inBounds(
          { left: 500, top: -100, height: 500, width: 200 },
          { left: 0, top: 0, width: 1000, height: 1000 }
        )
      ).toBeTruthy();
    });

    it("should check for mix overlap", () => {
      expect(
        inBounds(
          { left: 0, top: 0, width: 1000, height: 1000 },
          { left: 500, top: 500, height: 1000, width: 1000 }
        )
      ).toBeTruthy();
      expect(
        inBounds(
          { left: 500, top: 500, height: 1000, width: 1000 },
          { left: 0, top: 0, width: 1000, height: 1000 }
        )
      ).toBeTruthy();
    });
  });
});
