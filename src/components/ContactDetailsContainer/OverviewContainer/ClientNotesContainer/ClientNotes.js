import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { styled } from "@mui/system";
import TextField from '@mui/material/TextField';
import ContactSectionCard from 'packages/ContactSectionCard';
import { Button } from 'components/ui/Button';
import EditIcon from 'components/icons/icon-edit';
import styles from './ClientNotes.module.scss';
import { useLeadDetails } from 'providers/ContactDetails';


const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-input.Mui-disabled': {
    opacity: 1,
    WebkitTextFillColor: 'rgb(0.26,0.29,0.32)',
  },
});

const ClientNotesField = ({ notes, setNotes, isEditing }) => {

  return (
    <CustomTextField
      id="outlined-basic"
      placeholder="Add a note"
      variant="outlined"
      value={notes}
      fullWidth
      onChange={(e) => setNotes(e.target.value)}
      multiline
      rows={3}
      disabled={!isEditing}
    />
  );
};

export const ClientNotes = () => {
  const { leadDetails, updateClientNotes } = useLeadDetails();
  const [notes, setNotes] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    if (leadDetails) {
      setNotes(leadDetails.notes || '');
      setTempNotes(leadDetails.notes || '');
    }
  }, [leadDetails]);

  const handleSaveNotes = () => {
    const updatedDetails = { ...leadDetails, notes, primaryContact: 'phone' };
    updateClientNotes(leadDetails, updatedDetails);
    setIsEditing(false);
  };

  const handleCancelNotes = () => {
    setNotes(tempNotes);
    setIsEditing(false);
  };

  return (
    <ContactSectionCard
      title="Client Notes"
      className={styles.clientNotesContainer}
      isDashboard
      contentClassName={styles.clientNotesContainer_content}
    >
      <Box className={styles.noteInputContainer}>
        <Box sx={{
          width: {
            sm: '100%',
            md: '80%',
          },
        }} >
          <ClientNotesField
            notes={notes}
            setNotes={setNotes}
            isEditing={isEditing}
          />
        </Box>
        <Box width="20%" className={styles.buttonContainer}>
          {isEditing ? (
            <>
              <Button
                label="Cancel"
                className={styles.deleteButton}
                type="tertiary"
                onClick={handleCancelNotes}
              />
              <Button
                label="Save"
                className={styles.editButton}
                onClick={handleSaveNotes}
                type="tertiary"
                disabled={!notes}
              />
            </>
          ) : (
            <Button
              icon={<EditIcon color="#ffffff" />}
              label="Edit"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
              type="tertiary"
              iconPosition="right"
            />
          )}
        </Box>
      </Box>
    </ContactSectionCard>
  );
};
