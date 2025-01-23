import React, { forwardRef, useMemo } from "react";
import PlanDetailsTableWithCollapse from "../planDetailsTableWithCollapse";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const labelMap = {
  1: "Preferred Generic",
  2: "Generic",
  3: "Preferred Brand",
  4: "Non-Preferred Drug",
  5: "Specialty Tier",
};

export default forwardRef(
  ({ planData, isPreffered, isRetail, header, className }, ref) => {
    const columns = useMemo(
      () => [
        {
          Header: header,
          columns: [
            {
              hideHeader: true,
              accessor: "label",
            },
            {
              hideHeader: true,
              accessor: "value",
            },
          ],
        },
      ],
      [header]
    );
    const data = [];

    if (planData.formularyTiers && Array.isArray(planData.formularyTiers)) {
      planData.formularyTiers.forEach((tier) => {
        var values = [];
        var label = labelMap[tier.tierNumber];
        if (tier && Array.isArray(tier.copayPrices)) {
          tier.copayPrices.forEach((copay) => {
            if (
              copay.isPreferredPharmacy === isPreffered &&
              copay.isMailOrder === !isRetail
            ) {
              if (copay.costType === 1) {
                values.push(
                  <>
                    <div className={"copay"}>
                      <div className={"label"}>
                        {currencyFormatter.format(copay.cost)}
                      </div>{" "}
                      <div className={"supply"}>
                        copay ({copay.daysOfSupply}-day supply)
                      </div>
                    </div>
                  </>
                );
              } else if (copay.costType === 2) {
                values.push(
                  <>
                    <div className="copay">
                      <div className="label">
                        {Math.round(copay.cost * 100)}%
                      </div>
                      <div className="supply">
                        coinsurance ({copay.daysOfSupply}-day supply)
                      </div>
                    </div>
                  </>
                );
              }
            }
          });
        }
        if (values.length > 0) {
          data.push({
            label: <span className={"label"}>{label}</span>,
            value: values,
          });
        }
      });
    }

    return (
      <div className={className} ref={ref}>
        <PlanDetailsTableWithCollapse
          columns={columns}
          data={data}
          header={header}
          compareTable={true}
        />
      </div>
    );
  }
);
