import React from "react";
import { FlashProvider } from "contexts/flash";
import useLoading from "hooks/useLoading";
import { render, waitFor } from "@testing-library/react";

describe("useLoading", () => {
  it("has begin and end methods", async () => {
    const TestEl = () => {
      const { begin, end } = useLoading();
      return typeof begin === "function" && typeof end === "function"
        ? "Pass"
        : "Fail";
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("Pass");
  });
});
