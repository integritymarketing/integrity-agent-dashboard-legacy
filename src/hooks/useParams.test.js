import React from "react";
import useParams from "hooks/useParams";
import { render } from "@testing-library/react";

describe("useParams", () => {
  const TEST_URL_PARAMS = "?known=propval&bool=";
  it("returns null for unknown props", () => {
    const TestEl = () => {
      const params = useParams(TEST_URL_PARAMS);
      return params.get("unknown");
    };
    const { container } = render(<TestEl />);
    expect(container.textContent).toBe("");
  });

  it("returns the value for known props", () => {
    const TestEl = () => {
      const params = useParams(TEST_URL_PARAMS);
      return params.get("known");
    };
    const { container } = render(<TestEl />);
    expect(container.textContent).toBe("propval");
  });

  it("returns empty string for boolean props", () => {
    const TestEl = () => {
      const params = useParams(TEST_URL_PARAMS);
      return params.get("bool");
    };
    const { container } = render(<TestEl />);
    expect(container.textContent).toBe("");
  });
});
