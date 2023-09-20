import Box from "@mui/material/Box";

import styles from "./styles.module.scss";

function HiddenRow() {
    return (
        <tr className={styles.hidden}>
            <td><Box width={240}/></td>
            <td><Box width={150}/></td>
            <td><Box width={150}/></td>
            <td><Box width={100}/></td>
            <td><Box width={100}/></td>
            <td><Box width={100}/></td>
            <td><Box width={100}/></td>
        </tr>
    )
}

export default HiddenRow;