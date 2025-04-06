import PropTypes from 'prop-types';
import SelectionList from '../Common/SelectionList';

const SelectIulProduct = ({ handleSelectIulGoal }) => {
  return (
    <SelectionList
      title='What is your Indexed Universal Life Goal?'
      selectionList={['Accumulation', 'Protection']}
      handleSelectItem={handleSelectIulGoal}
    />
  );
};

SelectIulProduct.propTypes = {
  handleSelectIulGoal: PropTypes.func.isRequired,
};

export default SelectIulProduct;
