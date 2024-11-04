import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./styles.module.scss";

const SelectionList = ({ title, selectionList, handleSelectItem, disableOption }) => {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: "24px",
                    marginBottom: "8px",
                    color: "#052A63",
                }}
            >
                {title}
            </Typography>
            <Box className={styles.selectionListContainer}>
                {selectionList?.map((item, index) => (
                    <Box
                        className={`${styles.selectItemLabel} ${disableOption?.(item) ? styles.disableOption : ""}`}
                        key={index}
                        onClick={() => handleSelectItem(item)}
                    >
                        {item}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SelectionList;
