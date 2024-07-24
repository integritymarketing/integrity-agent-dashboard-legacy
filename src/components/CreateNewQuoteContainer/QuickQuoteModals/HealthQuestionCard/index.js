import { useCreateNewQuote } from "providers/CreateNewQuote";
import SelectionList from "../../Common/SelectionList";

const HealthQuestionCard = () => {
    const { handleSelectedHealthProductType } = useCreateNewQuote();

    return (
        <SelectionList
            title="What type of Health Product?"
            selectionList={["Medicare Advantage", "Medicare Supplement"]}
            handleSelectItem={handleSelectedHealthProductType}
        />
    );
};

export default HealthQuestionCard;
