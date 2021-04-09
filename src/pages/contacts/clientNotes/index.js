import React, { useState, Fragment } from 'react'
import { Button } from "../../../components/ui/Button";
import './client-notes.scss';

export default function ClientNotes(props) {
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState();
    const handleOnChange = (e) => setValue(e.currentTarget.value)
    const handleOnEdit = () => setIsEdit(true);
    const handleOnCancel = () => setIsEdit(false);
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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
                        <Button onClick={handleOnCancel} label="Cancel" type="secondary" />
                        <Button label="Save" />
                    </div>
                    : null}
            </div>
        </Fragment>
    )
}
