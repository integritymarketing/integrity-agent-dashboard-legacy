import { StrictMode } from "react";
import { LeadDetailsProvider } from "./LeadDetailsProvider";
import { OverViewProvider } from "./OverViewProvider";
import { HealthProvider } from "./HealthProvider";
import { PoliciesProvider } from "./PoliciesProvider";
import { ScopeOfAppointmentProvider } from "./ScopeOfAppointmentProvider";
import { DuplicateContactsProvider } from "./DuplicatesContactsProvider";
import { CallsProvider } from "./CallsProvider";

export const ContactDetailsProvider = ({ children }) => {
    return (
        <StrictMode>
            <DuplicateContactsProvider>
                <LeadDetailsProvider>
                    <HealthProvider>
                        <OverViewProvider>
                            <ScopeOfAppointmentProvider>
                                <CallsProvider>
                                    <PoliciesProvider>{children}</PoliciesProvider>
                                </CallsProvider>
                            </ScopeOfAppointmentProvider>
                        </OverViewProvider>
                    </HealthProvider>
                </LeadDetailsProvider>
            </DuplicateContactsProvider>
        </StrictMode>
    );
};
