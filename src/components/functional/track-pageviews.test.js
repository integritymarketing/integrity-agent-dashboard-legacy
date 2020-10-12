import React from "react";
import { BrowserRouter } from "react-router-dom";
import { cleanup } from "@testing-library/react";

import TrackPageviews from "./track-pageviews";
import analyticsService from "services/analyticsService";
import { renderWithRouter } from "utils/testing";

afterEach(cleanup);

const myTestRouter = (route) =>
  renderWithRouter(
    <BrowserRouter>
      <TrackPageviews />
    </BrowserRouter>,
    {
      route: route,
    }
  );

jest.mock("services/analyticsService");

analyticsService.fireEvent = jest.fn();

test("<TrackPageviews />", () => {
  const testUrl1 = "/test-pathname";
  myTestRouter(testUrl1);
  expect(analyticsService.fireEvent).toBeCalledTimes(1);
  expect(analyticsService.fireEvent).toBeCalledWith("pageChange", {
    pagePath: testUrl1,
    pageUrl: `http://localhost${testUrl1}`,
  });

  const testUrl2 = "/test-another-pathname";
  myTestRouter(testUrl2);
  expect(analyticsService.fireEvent).toBeCalledTimes(2);
  expect(analyticsService.fireEvent).toBeCalledWith("pageChange", {
    pagePath: testUrl2,
    pageUrl: `http://localhost${testUrl2}`,
  });
});
