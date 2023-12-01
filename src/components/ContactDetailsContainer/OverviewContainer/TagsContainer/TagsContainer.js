import React, { useEffect, useState } from 'react'
import Label from '../CommonComponents/Label'
import SectionContainer from '../CommonComponents/SectionContainer'
import { TAG_ITEMS } from './TagsContainer.constants'
import Accordion from '../CommonComponents/Accordion'
import clientsService from "services/clientsService";

const TagsContainer = function () {
    const [tags, setTags] = useState([])
    const transformData = (data) => {
        return data.map(category => ({
            label: category.tagCategoryName,
            items: category.tags.map(tag => ({
                label: tag.metadata,
                // icon: getIconName(tag.tagLabel)
            }))
        }));
    };

    async function fetchTags() {
        const data = await clientsService.getTagsGroupByCategory()
        const tags = transformData(JSON.parse(JSON.stringify(data)))
        console.log(tags)
        setTags(tags)
    }

    useEffect(() => {
        fetchTags()
    }, [])

    return <div>
        <Label value="Tags" />
        <SectionContainer>
            {tags.map(item => <Accordion label={item.label} items={item.items} />)}
        </SectionContainer>
    </div>
}

export default TagsContainer