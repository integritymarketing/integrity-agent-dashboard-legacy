import authService from "./authService";

const mock_authAPIRequest = jest.fn().mockResolvedValue("mock");
authService._authAPIRequest = mock_authAPIRequest;

beforeEach(() => {
  mock_authAPIRequest.mockReset();
});

it("authService setUserProfile", async () => {
  const mockUser = { userId: 123, name: "John Doe" };
  const mock_getUser = jest.fn().mockResolvedValue(mockUser);
  authService.getUser = await mock_getUser;
  authService.setUserProfile();
  expect(mock_getUser).toHaveBeenCalledTimes(1);
});

it("authService createSigninRequest", async () => {
  const asyncMock = jest.fn().mockResolvedValue("create sign in request");
  authService.UserManager.createSigninRequest = await asyncMock;
  authService.createSigninRequest();
  expect(authService.UserManager.createSigninRequest).toHaveBeenCalledTimes(1);
});

it("authService sendConfirmationEmail", async () => {
  const values = {
    subject: "Test Email",
    body: "This is a test",
  };
  authService.sendConfirmationEmail(values);
  expect(authService._authAPIRequest).toHaveBeenCalledTimes(1);
  expect(authService._authAPIRequest).toHaveBeenCalledWith(
    "/resendconfirmemail",
    "POST",
    values
  );
});

it("authService confirmEmail", async () => {
  const values = {
    subject: "Test Email",
    body: "This is a test",
  };
  authService.confirmEmail(values);
  expect(authService._authAPIRequest).toHaveBeenCalledTimes(1);
  expect(authService._authAPIRequest).toHaveBeenCalledWith(
    "/confirmemail",
    "POST",
    values
  );
});

it("authService registerUser", async () => {
  const values = {
    name: "john doe",
    email: "test@test.com",
  };
  authService.registerUser(values);
  expect(authService._authAPIRequest).toHaveBeenCalledTimes(1);
  expect(authService._authAPIRequest).toHaveBeenCalledWith(
    "/register",
    "POST",
    values
  );
});

// it("authService loginUser", async () => {
//   const values = {
//     username: "johndoe",
//     password: "1234",
//   };
//   const isClinetId = true;
//   authService.loginUser(values);
//   expect(authService._authAPIRequest).toHaveBeenCalledTimes(1);
//   expect(authService._authAPIRequest).toHaveBeenCalledWith(
//     "/login",
//     "POST",
//     values,
//     isClinetId
//   );
// });

it("authService logoutUser", async () => {
  authService.logoutUser(123456);
  expect(authService._authAPIRequest).toHaveBeenCalledTimes(1);
  expect(authService._authAPIRequest).toHaveBeenCalledWith(
    `/logout?logoutId=123456`
  );
});

it("authService getServerError", async () => {
  const mockFetch = jest.fn().mockResolvedValue({ message: "Error 123" });
  global.fetch = await mockFetch;
  const response = await authService.getServerError(123);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith("/error?errorId=123");
  expect(response).toEqual({ message: "Error 123" });
});

it("authService handleExpiredToken", async () => {
  const mocksigninRedirect = jest.fn().mockResolvedValue("mock redirect");
  authService.signinRedirect = mocksigninRedirect;
  authService.handleExpiredToken();
  expect(mocksigninRedirect).toHaveBeenCalledTimes(1);
});
