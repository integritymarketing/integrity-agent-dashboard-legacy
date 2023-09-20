import Box from "@mui/material/Box";

function HiddenRow() {
    return (
        <tr>
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