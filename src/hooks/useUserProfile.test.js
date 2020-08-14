import React from "react";
import useUserProfile from "hooks/useUserProfile";
import { render, waitFor } from "@testing-library/react";
import AuthContext from "contexts/auth";

describe("useUserProfile", () => {
  it("returns user profile from API", async () => {
    const TestEl = () => {
      const user = useUserProfile();
      return user.fullName;
    };
    const auth = {
      getUser: jest.fn(() => {
        return Promise.resolve({
          profile: {
            fullName: "test user",
            firstName: "test",
            lastName: "user",
            npn: "",
            email: "",
          },
        });
      }),
    };
    const { container } = render(
      <AuthContext.Provider value={auth}>
        <TestEl />
      </AuthContext.Provider>
    );
    await waitFor(() => expect(container.textContent).toBe("test user"));
  });
});
