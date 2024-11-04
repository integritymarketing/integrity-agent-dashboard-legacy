import PropTypes from "prop-types";
import SelectionList from "../../Common/SelectionList";

const IulGoalQuestionCard = ({ handleSelectIulGoal }) => {
    return (
        <SelectionList
            title="What is your Indexed Universal Life Goal?"
            selectionList={["Accumulation", "Protection"]}
            handleSelectItem={handleSelectIulGoal}
        />
    );
};

IulGoalQuestionCard.propTypes = {
    handleSelectIulGoal: PropTypes.func.isRequired,
};

export default IulGoalQuestionCard;
