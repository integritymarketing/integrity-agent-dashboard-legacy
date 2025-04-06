import { useMemo } from 'react';
import SelectionList from '../Common/SelectionList';
import { LIFE_QUESTION_CARD_LIST } from './constants';
import ButtonCircleArrow from 'components/icons/button-circle-arrow';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SelectLifeProduct = ({
  handleSelectLifeProductType,
  quickQuoteLeadId,
  onClose,
}) => {
  const navigate = useNavigate();
  const cardsList = useMemo(
    () => Object.values(LIFE_QUESTION_CARD_LIST).slice(0, 3),
    []
  );

  const handleCalculateCoverageNeeds = () => {
    onClose();
    sessionStorage.removeItem('currentCalculationStep');
    navigate(`/coverage-calculations/${quickQuoteLeadId}`);
  };

  return (
    <>
      <SelectionList
        title='What type of Life Product?'
        selectionList={cardsList}
        handleSelectItem={handleSelectLifeProductType}
        gridSize={12}
      />
      <Box textAlign='center'>
        <Typography my={1} color='#052A63' variant='h3'>
          or
        </Typography>
        <Button
          variant='contained'
          size='medium'
          endIcon={<ButtonCircleArrow />}
          onClick={handleCalculateCoverageNeeds}
        >
          Calculate Coverage Needs
        </Button>
      </Box>
    </>
  );
};

export default SelectLifeProduct;
