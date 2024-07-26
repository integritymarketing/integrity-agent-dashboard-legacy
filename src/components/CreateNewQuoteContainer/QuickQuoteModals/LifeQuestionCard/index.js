import { useCreateNewQuote } from "providers/CreateNewQuote";
import SelectionList from "../../Common/SelectionList";

const LifeQuestionCard = () => {
    const { handleSelectLifeProductType } = useCreateNewQuote();

    return (
        <SelectionList
            title="What type of Life Product?"
            selectionList={["Final Expense", "Indexed Universal Life", "Term"]}
            handleSelectItem={handleSelectLifeProductType}
        />
    );
};

export default LifeQuestionCard;