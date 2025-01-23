import SAExpiredModal from "../SAHealthProduct/SAPermissionModal/ExpiredModal";
import { SAPModalProvider } from "../SAHealthProduct/providers/SAPModalProvider";
import { SALifeProductTable } from "./SALifeProductTable";
import { SALifeProductProvider } from "./providers/SALifeProductProvider";

function SALifeProduct() {
    return (
        <SAPModalProvider>
            <SALifeProductProvider>
                <SALifeProductTable />
            </SALifeProductProvider>
            <SAExpiredModal content="This self-attested permission was not verified after 33 days and has been removed." />
        </SAPModalProvider>
    );
}

export default SALifeProduct;