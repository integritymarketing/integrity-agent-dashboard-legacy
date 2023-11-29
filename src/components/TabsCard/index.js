import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import usePreferences from "hooks/usePreferences";

import { DesktopTab } from "./DesktopTab";
import { MobileTab } from "./MobileTab";
import styles from "./styles.module.scss";

const TabsCard = ({ tabs, preferencesKey, statusIndex, handleWidgetSelection, isMobile }) => {
    const [, setValue] = usePreferences(0, preferencesKey);

    const onTabClick = (index, policyCount) => {
        handleWidgetSelection(index, policyCount);
        setValue(index, preferencesKey);
    };

    return (
        <Box className={styles.tabContainer}>
            {tabs?.map((tab, index) => (
                <>
                    {isMobile ? (
                        <MobileTab
                            key={tab?.policyStatus + index}
                            onTabClick={onTabClick}
                            index={index}
                            tab={tab}
                            tabCount={tabs.length}
                        />
                    ) : (
                        <DesktopTab
                            key={tab?.policyStatus + index}
                            statusIndex={statusIndex}
                            onTabClick={onTabClick}
                            index={index}
                            tab={tab}
                            tabCount={tabs.length}
                        />
                    )}
                </>
            ))}
        </Box>
    );
};

TabsCard.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            policyCount: PropTypes.number,
            policyStatusColor: PropTypes.string,
            policyStatus: PropTypes.string,
        })
    ).isRequired,
    preferencesKey: PropTypes.string,
    statusIndex: PropTypes.number,
    handleWidgetSelection: PropTypes.func,
    isMobile: PropTypes.bool,
};

export default TabsCard;
