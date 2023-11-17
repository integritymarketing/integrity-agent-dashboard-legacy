import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Arrow from "components/icons/down";

import styles from "./styles.module.scss";

import { useContactsListContext } from "../providers/ContactsListProvider";

const DEFAULT_PAGE_ITEM = 12;

function LoadMoreButton() {
    const { setPageSize, pageResult, layout } = useContactsListContext();

    const onLoadMoreHandle = () => {
        setPageSize((prev) => prev + DEFAULT_PAGE_ITEM);
    };

    if (pageResult?.totalPages === 1) {
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
