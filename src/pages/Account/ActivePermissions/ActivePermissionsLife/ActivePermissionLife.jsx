import { APLifeTable } from "./APLifeTable";

import { APLifeProvider } from "../providers/APLifeProvider";

function ActivePermissionLife() {
    return (
        <APLifeProvider>
            <APLifeTable />
        </APLifeProvider>
    );
}

export default ActivePermissionLife;
