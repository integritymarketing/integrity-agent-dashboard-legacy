import SelectionList from "../../Common/SelectionList";
import { LIFE_QUESTION_CARD_LIST } from "./constants";

const LifeQuestionCard = ({ handleSelectLifeProductType, IUL_FEATURE_FLAG }) => {
    return (
        <SelectionList
            title="What type of Life Product?"
            selectionList={Object.values(LIFE_QUESTION_CARD_LIST)}
            handleSelectItem={handleSelectLifeProductType}
        />
    );
};

export default LifeQuestionCard;
