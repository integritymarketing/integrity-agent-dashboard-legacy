import React from "react";
import validationService from "./validationService";

describe("validateRequired", () => {
  it("returns null on non-empty string input", () => {
    const results = [
      validationService.validateRequired("a"),
      validationService.validateRequired("abc"),
      validationService.validateRequired("Mr Rogers"),
      validationService.validateRequired("123"),
      validationService.validateRequired("!"),
      validationService.validateRequired(" "),
      validationService.validateRequired(
        "A long string with spaces and everything."
      ),
    ];
    expect(results.filter((res) => res !== null)).toEqual([]);
  });

  it("returns an error string for empty string input", () => {
    const actual = validationService.validateRequired("");
    expect(typeof actual).toBe("string");
  });

  it("defaults to the label 'Field'", () => {
    const actual = validationService.validateRequired("");
    expect(actual).toMatch("Field");
    expect(actual).not.toMatch("NPN");
    expect(actual).not.toMatch("Password");
  });

  it("uses an optional label string", () => {
    const npnActual = validationService.validateRequired("", "NPN");
    expect(npnActual).not.toMatch("Field");
    expect(npnActual).toMatch("NPN");

    const passwordActual = validationService.validateRequired("", "Password");
    expect(passwordActual).not.toMatch("Field");
    expect(passwordActual).toMatch("Password");
  });
});

describe("validateUsername", () => {
  it("must be least 2 characters", () => {
    const shortResult = validationService.validateUsername("a");
    expect(shortResult).toMatch("NPN must be 2 characters or more");
  });

  it("must be no more than 50 characters", () => {
    const longResult = validationService.validateUsername(
      "a451246sa5a451246sa5a451246sa5a451246sa5a451246sa5a451246sa5"
    );
    expect(longResult).toMatch("NPN must be 50 characters or less");
  });

  it("defaults to the label 'NPN'", () => {
    const actual = validationService.validateUsername("b");
    expect(actual).toMatch("NPN must be 2 characters or more");
  });

  it("uses an optional label string", () => {
    const actual = validationService.validateUsername("c", "Custom label");
    expect(actual).toMatch("Custom label must be 2 characters or more");
    expect(actual).not.toMatch("NPN must be 2 characters or more");
  });
});

describe("validatePasswordAccess", () => {
  it("validates as a required field", () => {
    const results = [
      validationService.validatePasswordAccess("a"),
      validationService.validatePasswordAccess("abc"),
      validationService.validatePasswordAccess("Mr Rogers"),
      validationService.validatePasswordAccess("123"),
      validationService.validatePasswordAccess("!"),
      validationService.validatePasswordAccess(" "),
      validationService.validatePasswordAccess(
        "A long string with spaces and everything."
      ),
    ];
    expect(results.filter((res) => res !== null)).toEqual([]);

    const actual = validationService.validatePasswordAccess("");
    expect(typeof actual).toBe("string");
  });

  it("defaults to the label 'Password'", () => {
    const actual = validationService.validatePasswordAccess("");
    expect(actual).toMatch("Password");
    expect(actual).not.toMatch("Field");
  });

  it("uses an optional label string", () => {
    const actual = validationService.validatePasswordAccess("", "Field");
    expect(actual).toMatch("Field");
    expect(actual).not.toMatch("Password");
  });
});

describe("validatePasswordCreation", () => {
  it("is required", () => {
    const emptyResult = validationService.validatePasswordCreation("");
    expect(emptyResult).toMatch("is required");
  });

  it("must be 8 chracters long", () => {
    const shortResult = validationService.validatePasswordCreation("Pass!12");
    expect(shortResult).toMatch("at least 8 characters");

    const validResult = validationService.validatePasswordCreation("Pass!123");
    expect(validResult).toBe(null);
  });

  it("must have a lowercase letter", () => {
    const actual = validationService.validatePasswordCreation("PASS!123");
    expect(actual).toMatch("at least one lowercase letter");
  });

  it("must have an uppercase letter", () => {
    const actual = validationService.validatePasswordCreation("pass!123");
    expect(actual).toMatch("at least one uppercase letter");
  });

  it("must have a number", () => {
    const actual = validationService.validatePasswordCreation("Pass!num");
    expect(actual).toMatch("at least one number");
  });

  it("must have a non-alpha digit", () => {
    const actual = validationService.validatePasswordCreation("Pass1234");
    expect(actual).toMatch("at least one non-alphanumeric character");
  });

  it("defaults to the label 'Password'", () => {
    const actual = validationService.validatePasswordCreation("");
    expect(actual).toMatch("Password");
    expect(actual).not.toMatch("Field");
  });

  it("uses an optional label string", () => {
    const actual = validationService.validatePasswordCreation("", "Field");
    expect(actual).toMatch("Field");
    expect(actual).not.toMatch("Password");
  });
});

describe("validateFieldMatch", () => {
  it("returns a function to validate another string against", () => {
    const actual = validationService.validateFieldMatch("a");
    expect(typeof actual).toBe("function");
  });

  it("matches string exactly or errors", () => {
    const validateA = validationService.validateFieldMatch("a");
    const caseSensitive = validateA("A");
    expect(caseSensitive).toMatch("must match");

    const withSpaces = validateA("a  ");
    expect(withSpaces).toMatch("must match");

    const multiple = validateA("aaaa");
    expect(multiple).toMatch("must match");

    const lowercase = validateA("a");
    expect(lowercase).toBe(null);
  });

  it("defaults to the label 'Passwords'", () => {
    const actual = validationService.validateFieldMatch("a")("b");
    expect(actual).toMatch("Passwords");
    expect(actual).not.toMatch("Field");
  });

  it("uses an optional label string in returned function", () => {
    const actual = validationService.validateFieldMatch("a")("b", "Field");
    expect(actual).toMatch("Field");
    expect(actual).not.toMatch("Passwords");
  });
});

describe("validateEmail", () => {
  it("returns no error string for empty string input", () => {
    const actual = validationService.validateEmail("");
    expect(typeof actual).not.toBe("string");
  });

  it("returns an error string for non-valid email addresses", () => {
    const invalidResults = [
      "email address",
      "e]]@%^&*.com",
      "at@@@at.at",
      "almost@valid.",
      "google.com",
      "http://url.com",
    ].map(validationService.validateEmail);

    expect(invalidResults.some((result) => result === null)).toBe(false);
  });

  it("returns no error string for valid email addresses", () => {
    const validResults = [
      "email@address.com",
      "UPPER.CASE@email.co.uk",
      "number123+extra@gmail.com",
    ].map(validationService.validateEmail);

    expect(validResults.some((result) => result !== null)).toBe(false);
  });

  it("defaults to the label 'Email Address'", () => {
    const actual = validationService.validateEmail("bademail");
    expect(actual).toMatch("Email Address");
    expect(actual).not.toMatch("Field");
    expect(actual).not.toMatch("Password");
  });

  it("uses an optional label string", () => {
    const npnActual = validationService.validateEmail("bademail", "NPN");
    expect(npnActual).not.toMatch("Field");
    expect(npnActual).not.toMatch("Email Address");
    expect(npnActual).toMatch("NPN");

    const passwordActual = validationService.validateEmail(
      "bademail",
      "Password"
    );
    expect(passwordActual).not.toMatch("Field");
    expect(passwordActual).not.toMatch("Email Address");
    expect(passwordActual).toMatch("Password");
  });
});

describe("composeValidator", () => {
  it("returns a function", () => {
    const actual = validationService.composeValidator();
    expect(typeof actual).toBe("function");
  });

  it("returns no error for inputs when no validators are provided", () => {
    const emptyValidator = validationService.composeValidator();
    const actual = emptyValidator("Test input");
    expect(actual).toBe(null);
  });

  it("returns the first error in list of validators", () => {
    const testValidator = validationService.composeValidator([
      () => null,
      () => null,
      () => "First Error",
      () => "Second Error",
      () => "Third Error",
    ]);
    const actual = testValidator("Test input");
    expect(actual).toBe("First Error");
  });

  it("passes input and label parameters into validators", () => {
    const testValidator = validationService.composeValidator([
      () => null,
      (input, label) => `${label} ${input}`,
    ]);
    const actual = testValidator("input", "label");
    expect(actual).toBe("label input");
  });
});

describe("validateMultiple", () => {
  it("returns an object of errors", () => {
    const values = { test: "test value" };
    const actual = validationService.validateMultiple(
      [{ validator: () => null, name: "test" }],
      values
    );
    expect(actual).toEqual({});
  });

  it("omits key for valid objects", () => {
    const values = { test: "test value", other: "" };
    const actual = validationService.validateMultiple(
      [
        { validator: () => null, name: "test" },
        { validator: () => "other is required", name: "other" },
      ],
      values
    );
    expect(actual.test).toBeUndefined();
  });

  it("includes key for invalid objects", () => {
    const values = { test: "test value", other: "" };
    const actual = validationService.validateMultiple(
      [
        { validator: () => null, name: "test" },
        { validator: () => "other is required", name: "other" },
      ],
      values
    );
    expect(actual.other).toBeDefined();
    expect(actual.other).toBe("other is required");
  });

  it("extends existing error objects", () => {
    const values = { test: "test value", other: "" };
    const existingErrors = { page: "page has error" };
    const noAdditionalErrors = validationService.validateMultiple(
      [{ validator: () => null, name: "test" }],
      values,
      existingErrors
    );
    expect(noAdditionalErrors).toEqual(existingErrors);

    const withAdditionalErrors = validationService.validateMultiple(
      [{ validator: () => "test error", name: "test" }],
      values,
      existingErrors
    );
    expect(withAdditionalErrors).not.toEqual(existingErrors);
    expect(withAdditionalErrors).toEqual({
      page: "page has error",
      test: "test error",
    });
  });

  it("passes args param to validators", () => {
    const values = { test: "test value", other: "" };
    const noAdditionalErrors = validationService.validateMultiple(
      [
        {
          validator: (input, label) => `${label} - ${input}`,
          name: "test",
          args: ["custom label"],
        },
      ],
      values
    );
    expect(noAdditionalErrors).toEqual({
      test: "custom label - test value",
    });
  });
});
