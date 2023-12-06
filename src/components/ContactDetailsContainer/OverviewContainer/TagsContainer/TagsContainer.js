import React, { useEffect, useState } from "react";

import { Box } from "@mui/system";

import clientsService from "services/clientsService";

import styles from "./TagsContainer.module.scss";

import Accordion from "../CommonComponents/Accordion";

const TagsContainer = function () {
    const [tags, setTags] = useState([]);

    const transformData = (data) => {
        return data.map((category) => ({
            label: category.tagCategoryName,
            color: category.tagCategoryColor,
            items: category.tags.map((tag) => ({
                label: tag.tagLabel,
                // icon: getIconName(tag.tagLabel)
            })),
        }));
    };

    useEffect(() => {
        async function fetchTags() {
            const data = await clientsService.getTagsGroupByCategory();
            const transformedData = transformData(data);
            setTags(transformedData);
        }
        fetchTags();
    }, []);

    return (
        <Box>
            <Box className={styles.title}>Tags</Box>
            <Box className={styles.box}>
                {tags.map((item) => (
                    <Accordion label={item.label} items={item.items} />
                ))}
            </Box>
        </Box>
    );
};

export default TagsContainer;
