import plansService from "./plansService";

it("plansService searchPlans", async () => {
  var plans = await plansService.searchPlans();
  expect(plans).toBeDefined();
});
