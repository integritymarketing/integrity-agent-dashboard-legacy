import { useEffect } from "react";

import { useContactsListContext } from "pages/ContactsList/providers/ContactsListProvider";
import ContactListFilterOptionsV2 from "packages/ContactListFilterOptionsV2";

export default function ContactsFilter({ onFilterCountChange }) {
    const {
        selectedFilterSections,
        setSelectedFilterSections,
        resetData,
        filterSectionsConfig,
        setFilterSectionsConfig,
        fetchedFiltersSectionConfigFromApi,
        setFetchedFiltersSectionConfigFromApi,
    } = useContactsListContext();

    useEffect(() => {
        onFilterCountChange(selectedFilterSections);
    }, [selectedFilterSections]);

    return (
        <ContactListFilterOptionsV2
            setSelectedFilterSections={setSelectedFilterSections}
            selectedFilterSections={selectedFilterSections}
            resetData={resetData}
            filterSectionsConfig={filterSectionsConfig}
            setFilterSectionsConfig={setFilterSectionsConfig}
            fetchedFiltersSectionConfigFromApi={fetchedFiltersSectionConfigFromApi}
            setFetchedFiltersSectionConfigFromApi={setFetchedFiltersSectionConfigFromApi}
        />
    );
}
