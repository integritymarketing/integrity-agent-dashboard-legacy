import { StrictMode } from "react";
import { LeadDetailsProvider } from "./LeadDetailsProvider";
import { OverViewProvider } from "./OverViewProvider";
import { HealthProvider } from "./HealthProvider";
import { PoliciesProvider } from "./PoliciesProvider";
import { ScopeOfAppointmentProvider } from "./ScopeOfAppointmentProvider";

export const ContactDetailsProvider = ({ children }) => {
    return (
        <StrictMode>
            <LeadDetailsProvider>
                <HealthProvider>
                    <OverViewProvider>
                        <ScopeOfAppointmentProvider>
                            <PoliciesProvider>{children}</PoliciesProvider>
                        </ScopeOfAppointmentProvider>
                    </OverViewProvider>
                </HealthProvider>
            </LeadDetailsProvider>
        </StrictMode>
    );
};
