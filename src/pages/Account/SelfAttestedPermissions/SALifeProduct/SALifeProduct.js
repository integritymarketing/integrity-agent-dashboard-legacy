import { SALifeProductTable } from "./SALifeProductTable";
import { SALifeProductProvider } from "./providers/SALifeProductProvider";

function SALifeProduct() {
    return (
        <SALifeProductProvider>
            <SALifeProductTable />
        </SALifeProductProvider>
    );
}

export default SALifeProduct;
