import React from "react";
import QuestionAnswer from "components/ui/QuestionAnswer";
import "./index.scss";

export default function MedicareOverviewCard() {
  return (
    <>
      <QuestionAnswer question="Medicare Overview">
        <p>
          Medicare Part C, or Medicare Advantage, combines the benefits of
          Medicare Parts A, B and typically D. Medicare Advantage plans
          typically come with additional benefits that Original Medicare doesn’t
          have and are distributed by private insurance companies. In many
          cases, you’ll need to use health care providers who participate in the
          plan’s network and service area for the lowest costs. These plans set
          a limit on what you’ll have to pay out-of-pocket each year for covered
          services, which could help protect you from unexpected costs.
        </p>
      </QuestionAnswer>
      <QuestionAnswer question="Stand-alone Medicare Prescription Drug Plan (Part D)">
        <p>
          Medicare Part D only helps pay for prescription drugs — following
          federal rules. Part D is often added to Original Medicare (Part A and
          B) or Medicare Advantage plans that are offered by private insurance
          companies. You pay a monthly plan premium for Part D coverage to the
          insurance provider. Since the coverage rules of Medicare Part D are
          regulated by the federal government, the prescription drugs it covers
          may vary from year to year.
        </p>
      </QuestionAnswer>
      <QuestionAnswer question="Medicare Advantage Plans (Part C)">
        <p>
          Medicare Part C, or Medicare Advantage, combines the benefits of
          Medicare Parts A, B and typically D. Medicare Advantage plans
          typically come with additional benefits that Original Medicare doesn’t
          have and are distributed by private insurance companies. In many
          cases, you’ll need to use health care providers who participate in the
          plan’s network and service area for the lowest costs. These plans set
          a limit on what you’ll have to pay out-of-pocket each year for covered
          services, which could help protect you from unexpected costs.
        </p>
      </QuestionAnswer>
      <QuestionAnswer question="Examples of Medicare Advantage Plans include: ">
        <li className="list">
          Medicare Health Maintenance Organization (HMO) – Provides all the
          benefits of Original Medicare and sometimes includes Part D. In most
          HMOs, you can only get your care from doctors or hospitals in the
          plan’s network (except in emergencies).
        </li>
        <li className="list">
          Medicare Preferred Provider Organization (PPO) Plan – Provides all the
          benefits of Original Medicare and sometimes covers Part D. PPOs have
          network doctors and hospitals but you can also use out-of-network
          providers, typically at a higher cost.
        </li>
        <li className="list">
          Medicare Private Fee-For-Services (PFFS) Plan – A plan that allows you
          to go to any Medicare-approved doctor, hospital and provider. The
          health provider must agree to treat you and accept the PFFS plan’s
          payment, terms and conditions. If your PFFS plan has a network, you
          can see any of the network providers who have agreed to treat members
          of the plan. You typically will pay more for out-of-network providers.
        </li>
        <li className="list">
          Medicare Special Needs Plan (SNP) – A plan that has specific benefits
          intended for people with special health needs. Examples of special
          health needs include:
          <li className="nested-list">
            People who qualify for both Medicare and Medicaid
          </li>
          <li className="nested-list">People in nursing homes</li>
          <li className="nested-list">
            People with approved chronic health conditions
          </li>
        </li>
      </QuestionAnswer>
      <QuestionAnswer question="Medicare Supplement (Medigap) Products">
        <p>
          Medigap is Medicare Supplement Insurance that helps fill "gaps" in
          Original Medicare and is sold by private companies. A Medicare
          Supplement Insurance (Medigap) policy can help pay some of the
          remaining health care costs, like:
        </p>
        <li className="nested-list">Copayments</li>
        <li className="nested-list">Coinsurance</li>
        <li className="nested-list">Deductibles</li>
      </QuestionAnswer>
      <QuestionAnswer>
        <p>
          You must have Medicare Part A and Part B to get a Medicare Supplement
          plan. A Medigap plan is different from Medicare Part C because it only
          supplements your Original Medicare benefits. So, Medigap does not
          include Original Medicare or Part D coverage by itself.
        </p>
      </QuestionAnswer>
      <QuestionAnswer question="Ancillary Products">
        <p>
          You can get ancillary or secondary products through private insurance
          companies. These plans offer additional benefits to people who want
          separate coverage for things like dental, vision and hearing.
          Ancillary plans are not Medicare products.
        </p>
      </QuestionAnswer>
    </>
  );
}
