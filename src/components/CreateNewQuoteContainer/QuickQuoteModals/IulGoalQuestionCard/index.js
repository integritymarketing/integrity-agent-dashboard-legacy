import { useCreateNewQuote } from "providers/CreateNewQuote";
import SelectionList from "../../Common/SelectionList";

const IulGoalQuestionCard = () => {
    const { handleSelectIulGoal } = useCreateNewQuote();

    return (
        <SelectionList
            title="What is your Indexed Universal Life Goal?"
            selectionList={["Accumulation", "Protection"]}
            handleSelectItem={handleSelectIulGoal}
        />
    );
};

export default IulGoalQuestionCard;