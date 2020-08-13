import React from "react";
import { FlashProvider } from "contexts/flash";
import useFlashMessage from "hooks/useFlashMessage";
import { render } from "@testing-library/react";

describe("useFlashMessage", () => {
  it("defaults to not visible", () => {
    const TestEl = () => {
      const { isVisible } = useFlashMessage();
      return isVisible ? "Visible" : "Hidden";
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("Hidden");
  });

  it("becomes visible after show is called", () => {
    const TestEl = () => {
      const { isVisible, show } = useFlashMessage();
      React.useEffect(() => {
        show("Test message");
      }, []);
      return isVisible ? "Visible" : "Hidden";
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("Visible");
  });

  it("becomes hidden after show and dismiss are called", () => {
    const TestEl = () => {
      const { isVisible, show, dismiss } = useFlashMessage();
      React.useEffect(() => {
        show("Test message");
        dismiss();
      }, []);
      return isVisible ? "Visible" : "Hidden";
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("Hidden");
  });

  it("shows message within element as text", () => {
    const TestEl = () => {
      const { message, show } = useFlashMessage();
      React.useEffect(() => {
        show("Test message");
      }, []);
      return message;
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("Test message");
  });

  it("shows message within element as dom", () => {
    const TestEl = () => {
      const { message, show } = useFlashMessage();
      React.useEffect(() => {
        show(
          <div>
            <span>ABC</span>
            <span>123</span>
          </div>
        );
      }, []);
      return message;
    };
    const { container } = render(
      <FlashProvider>
        <TestEl />
      </FlashProvider>
    );
    expect(container.textContent).toBe("ABC123");
  });
});
