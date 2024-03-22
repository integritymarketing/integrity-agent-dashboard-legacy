import { Divider } from "@mui/material";
import Box from "@mui/material/Box";

import { CardHeader } from "./CardHeader";
import { CardStage } from "./CardStage";
import styles from "./styles.module.scss";

import { LoadMoreButton } from "../LoadMoreButton";
import { useContactsListContext } from "../providers/ContactsListProvider";
import { Reminder } from "components/icons/version-2/Reminder";
import CardBadge from "./CardBadge/CardBadge";
import LifeIcon from "./LifeIcon";
import HealthIcon from "./HealthIcon";

function ContactsCard() {
    const { tableData } = useContactsListContext();
    return (
        <Box className={styles.container}>
            <Box className={styles.cardWrapper}>
                {tableData.map((item) => {
                    const { lifePolicyCount, healthPolicyCount } = item;
                    return (
                        <Box key={item?.leadsId} className={styles.card}>
                            <CardHeader item={item} />
                            <Divider />
                            <Box className={styles.innerWrapper}>
                                <CardStage item={item} />
                                <CardBadge label="Reminders" Icon={<Reminder />} />
                                <CardBadge label="Contact" Icon={<Reminder />} />
                            </Box>

                            <Box className={styles.innerWrapper}>
                                <CardBadge label="Campaign" Icon={<Reminder />} />
                                <CardBadge label="Ask Integrity" Icon={<Reminder />} />
                                <CardBadge label="Life" Icon={<LifeIcon lifePolicyCount={lifePolicyCount} />} />
                                <CardBadge label="Health" Icon={<HealthIcon healthPolicyCount={healthPolicyCount} />} />
                            </Box>
                        </Box>
                    )
                })}
            </Box>
            <LoadMoreButton />
        </Box>
    );
}

export default ContactsCard;