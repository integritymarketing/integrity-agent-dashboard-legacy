import React from "react";
import ScrollToTop from "./scroll-to-top";
import { render, waitFor } from "@testing-library/react";
import { useLocation } from "react-router-dom";

// mock useLocation function of react router only
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(() => ({
    pathname: "localhost:3000/example/path",
  })),
}));

describe("useLoading", () => {
  it("scrolls to top on load", async () => {
    const scrollMock = jest.fn();
    global.scrollTo = scrollMock;
    render(<ScrollToTop />);
    expect(scrollMock).toHaveBeenCalledTimes(1);
    expect(scrollMock).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to top after pathname change", async () => {
    const scrollMock = jest.fn();
    global.scrollTo = scrollMock;
    const { rerender } = render(<ScrollToTop />);
    useLocation.mockImplementationOnce(() => ({
      pathname: "localhost:3000/example/path2",
    }));
    rerender(<ScrollToTop />);
    await waitFor(() => expect(scrollMock).toHaveBeenCalledTimes(2));
  });
});
