import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './styles.module.scss';

const SelectionList = ({
  title,
  selectionList,
  handleSelectItem,
  disableOption,
  gridSize = 12,
}) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '24px',
          marginBottom: '8px',
          color: '#052A63',
        }}
      >
        {title}
      </Typography>

      <Box className={styles.selectionListContainer}>
        <Grid container spacing={2}>
          {selectionList?.map((item, index) => (
            <Grid item xs={12} sm={gridSize} md={gridSize} key={index}>
              <Box
                className={`${styles.selectItemLabel} ${
                  disableOption?.(item) ? styles.disableOption : ''
                }`}
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SelectionList;
