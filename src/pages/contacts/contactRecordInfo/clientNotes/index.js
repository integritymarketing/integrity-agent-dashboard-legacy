import React, { useState, Fragment } from 'react'
import { Button } from "../../../../components/ui/Button";
import clientsService from "services/clientsService";
import './client-notes.scss';

export default function ClientNotes(props) {
    const [isEdit, setIsEdit] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [value, setValue] = useState(props.personalInfo.notes);
    const handleOnChange = (e) => setValue(e.currentTarget.value)
    const handleOnEdit = () => setIsEdit(true);
    const handleOnCancel = () => setIsEdit(false);
    const handleOnSave =async () => {
        try {
            setIsSaving(() => true)
            await clientsService.updateClient(props.personalInfo, { notes: value })
            setIsSaving(() => false)
        } catch(err) {
            // Handle error
        }
    }
    return (
        <Fragment>
            <div className="client-notes-card">
                <div className="header">
                    <div className="client-notes-heading">
                        <h4>Client Notes</h4>
                    </div>
                    {!isEdit
                        ? <div className="pull-right">
                            <Button label="Edit" onClick={handleOnEdit} type="tertiary"> </Button>
                        </div>
                        : null}
                </div>
                <hr />
                <div className="client-notes-card-body">
                    {!isEdit
                        ? <div className="client-notes">
                            <p>{value ? value : "Write client notes here..."}</p>
                        </div>
                        : <div className="client-notes-edit">
                            <textarea placeholder="Write client notes here..." value={value} onChange={handleOnChange} rows="5" cols="120">
                                {value}
                            </textarea>
                        </div>
                    }
                </div>
                {isEdit
                    ? <div className="button-group">
                        <Button disabled={isSaving} onClick={handleOnCancel} label="Cancel" type="secondary" />
                        <Button disabled={isSaving} onClick={handleOnSave} label="Save" />
                    </div>
                    : null}
            </div>
        </Fragment>
    )
}
