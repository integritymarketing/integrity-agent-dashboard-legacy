import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const getName = ({ firstName, middleName, lastName }) =>
    [firstName, middleName, lastName].filter(Boolean).join(" ") || "--";

const NameCell = ({ row }) => {
    const name = useMemo(() => getName(row), [row]);

    return (
        <Box width="150px">
            <Link to={`/contact/${row.leadsId}`} className={styles.customLink}>
                {name}
            </Link>
        </Box>
    );
};

NameCell.propTypes = {
    row: PropTypes.shape({
        firstName: PropTypes.string,
        middleName: PropTypes.string,
        lastName: PropTypes.string,
        leadsId: PropTypes.string,
        leadSource: PropTypes.string,
    }),
};

export default NameCell;
