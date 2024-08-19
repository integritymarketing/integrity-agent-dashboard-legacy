import SelectionList from "../../Common/SelectionList";

const LifeQuestionCard = ({ handleSelectLifeProductType, IUL_FEATURE_FLAG }) => {
    const disableOption = (option) => {
        if (["Indexed Universal Life", "Term"].includes(option) && IUL_FEATURE_FLAG) {
            return true;
        }
        return false;
    };

    return (
        <SelectionList
            title="What type of Life Product?"
            selectionList={["Final Expense", "Indexed Universal Life", "Term"]}
            handleSelectItem={handleSelectLifeProductType}
            disableOption={disableOption}
        />
    );
};

export default LifeQuestionCard;
