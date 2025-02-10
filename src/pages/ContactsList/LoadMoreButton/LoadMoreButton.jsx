import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Arrow from "components/icons/down";

import styles from "./styles.module.scss";

import { useContactsListContext } from "../providers/ContactsListProvider";

function LoadMoreButton() {
    const { fetchMoreContactsByPage, pageResult, layout, isFetchingTableData, isStartedSearching, selectedSearchLead } =
        useContactsListContext();

    const onLoadMoreHandle = () => {
        fetchMoreContactsByPage();
    };

    if (pageResult?.totalPages <= 1 || isFetchingTableData || isStartedSearching || selectedSearchLead) {
        return <></>;
    }

    const wrapperStyle = layout === "card" ? styles.showMoreCard : styles.showMoreRow;

    return (
        <Grid container justifyContent="center" className={wrapperStyle}>
            <Grid onClick={onLoadMoreHandle} display="flex" alignItems="center" gap={1} className={styles.showMoreLink}>
                <Arrow color="#4178FF" />
                <Box>Show More</Box>
            </Grid>
        </Grid>
    );
}

export default LoadMoreButton;
