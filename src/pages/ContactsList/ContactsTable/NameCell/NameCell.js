// Import PropTypes
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import { toTitleCase } from "utils/toTitleCase";

import styles from "./styles.module.scss";

function NameCell({ row }) {
    const getName = (_row) => {
        const name = [_row.original.firstName || "", _row.original.middleName || "", _row.original.lastName || ""]
            .join(" ")
            .trim();
        return name ? toTitleCase(name) : "--";
    };

    const name = getName(row);

    return (
        <>
            <Link to={`/contact/${row.original.leadsId}`} className={styles.customLink}>
                {name}
            </Link>
        </>
    );
}

NameCell.propTypes = {
    row: PropTypes.shape({
        original: PropTypes.shape({
            firstName: PropTypes.string,
            middleName: PropTypes.string,
            lastName: PropTypes.string,
            leadsId: PropTypes.string,
            leadSource: PropTypes.string,
        }),
    }),
};

export default NameCell;
