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

const scrollMock = jest.fn();
const scrollIntoViewMock = jest.fn();

const rootEl = {};
Object.defineProperty(rootEl, "scrollTop", {
  get: () => 0,
  set: scrollMock,
});

const { rerender } = render(<ScrollToTop rootEl={rootEl} />);

test("<ScrollToTop />, scrolls to top on load", async () => {
  expect(scrollMock).toHaveBeenCalledTimes(1);
  expect(scrollMock).toHaveBeenCalledWith(0);
});

test("<ScrollToTop />, scrolls to top after pathname change", async () => {
  scrollMock.mockReset();
  useLocation.mockImplementationOnce(() => ({
    pathname: "localhost:3000/example/path2",
  }));
  rerender(<ScrollToTop rootEl={rootEl} />);
  await waitFor(() => expect(scrollMock).toHaveBeenCalledTimes(1));
});

test("<ScrollToTop />, scrolls to hash", () => {
  scrollMock.mockReset();
  const hashSection = document.createElement("div");
  hashSection.setAttribute("id", "test-section");
  Object.defineProperty(hashSection, "scrollIntoView", {
    get: () => scrollIntoViewMock,
  });
  document.body.appendChild(hashSection);

  useLocation.mockImplementationOnce(() => ({
    pathname: "localhost:3000/example/path3",
    hash: "#test-section",
  }));
  rerender(<ScrollToTop rootEl={rootEl} />);

  expect(scrollMock).toHaveBeenCalledTimes(0);
  expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
});
