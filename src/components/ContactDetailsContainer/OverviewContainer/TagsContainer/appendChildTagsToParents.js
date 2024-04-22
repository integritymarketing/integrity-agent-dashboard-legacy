export const appendChildTagsToParents = (parentTags, childTags) => {
    // Create a copy of parentTags with empty tags arrays to avoid mutation
    const parentTagsCopy = parentTags.map((parent) => ({
        ...parent,
        tags: [],
    }));

    // Create a lookup map of parent tags by category ID for quick access
    const parentMap = parentTagsCopy.reduce((map, parent) => {
        map[parent.tagCategoryId] = parent;
        return map;
    }, {});

    // Append each child tag to its corresponding parent in the map
    childTags.forEach((childTag) => {
        const parent = parentMap[childTag.tag.tagCategory.parentCategoryId || childTag.tag.tagCategory.tagCategoryId];
        if (parent) {
            parent.tags.push({
                tagId: childTag.tag.tagId,
                tagLabel: childTag.tag.tagLabel,
                tagIconUrl: childTag.tag.tagIconUrl,
                metadata: childTag.tag.metadata,
            });
        }
    });

    return parentTagsCopy;
};
