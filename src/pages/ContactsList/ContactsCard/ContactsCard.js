import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import { CardHeader } from "./CardHeader";
import { CardLifeAndHealth } from "./CardLifeAndHealth";
import { CardStage } from "./CardStage";
import { CardTag } from "./CardTag";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { useContactsListContext } from "../providers/ContactsListProvider";

function ContactsCard() {
    const { tableData } = useContactsListContext();

    return (
        <Box className={styles.container}>
            <Box className={styles.cardWrapper}>
                {tableData.map((item) => (
                    <Box key={item?.leadsId} className={styles.card}>
                        <CardHeader item={item} />
                        <Divider />
                        <CardStage item={item} />
                        <Box className={styles.innerWrapper}>
                            <CardTag item={item} />
                            <CardLifeAndHealth />
                        </Box>
                    </Box>
                ))}
            </Box>
            <LoadMoreButton />
        </Box>
    );
}

export default ContactsCard;
