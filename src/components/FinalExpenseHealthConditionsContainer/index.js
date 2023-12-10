import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import tickCircle from "images/tick-circle.png";
import useFetch from "hooks/useFetch";
import ContactSectionCard from "packages/ContactSectionCard";
import Table from "packages/TableWrapper";
import FinalExpenseContactBar from "components/FinalExpensePlansContainer/FinalExpenseContactBar";
import Icon from "components/Icon";
import ButtonCircleArrow from "components/icons/button-circle-arrow";
import EditIcon from "components/icons/icon-edit";
import Plus from "components/icons/plus";
import { Button } from "components/ui/Button";
import GlobalFooter from "partials/global-footer";
import GlobalNav from "partials/global-nav-v2";
import AddNewConditionDialog from "./AddNewConditionDialog";
import styles from "./FinalExpenseHealhtConditionsContainer.module.scss";
import {
    ADD_NEW,
    CARD_TITLE,
    COMPLETED,
    CONDITIONS,
    DISCLAIMER_TEXT,
    EDIT,
    HEADER_TITLE,
    HEALTH_CONDITION_API,
    INCOMPLETE,
    OUTDATED,
    VIEW_QUOTE,
} from "./FinalExpenseHealthConditionsContainer.constants";
import IncompleteSvg from "./icons/incomplete.svg";
import OutdatedSvg from "./icons/outdated.svg";

const FinalExpenseHealthConditionsContainer = () => {
    const [healthConditions, setHealthConditions] = useState([]);
    const [selectedConditionForEdit, setSelectedConditionForEdit] = useState(null);
    const [, setIsHealthConditionsLoading] = useState(false);
    const [isAddNewActivityDialogOpen, setIsAddNewActivityDialogOpen] = useState(false);
    const { contactId } = useParams();
    const navigate = useNavigate();

    const { Get: getHealthConditions } = useFetch(`${HEALTH_CONDITION_API}${contactId}`);

    const getHealthConditionsListData = useCallback(async () => {
        setIsHealthConditionsLoading(true);
        const resp = await getHealthConditions();
        if (resp) {
            setHealthConditions([...resp]);
        }
        setIsHealthConditionsLoading(false);
    }, []);

    useEffect(() => {
        getHealthConditionsListData();
    }, []);

    const onClickViewQuote = () => {
        navigate(`/finalexpenses/create/${contactId}`);
    };

    const sectionHeaderChildren = () => {
        return (
            <div className={styles.wrapper}>
                <Button
                    icon={<Plus />}
                    iconPosition="right"
                    label={ADD_NEW}
                    onClick={() => {
                        setSelectedConditionForEdit(null);
                        setIsAddNewActivityDialogOpen(true);
                    }}
                    type="tertiary"
                    className={styles.buttonWithIcon}
                />
            </div>
        );
    };

    const columns = [
        {
            id: "name",
            Header: "",
            Cell: ({ row }) => {
                return <div className={styles.conditionNameCell}>{row.original.conditionName}</div>;
            },
        },
        {
            id: "status",
            Header: "",
            Cell: ({ row }) => {
                return (
                    <div className={styles.conditionStatusCell}>
                        {row.original.isComplete && (
                            <>
                                <Icon image={tickCircle} className={styles.tickCircle} />
                                <span className={styles.completedStatus}>{COMPLETED}</span>
                            </>
                        )}
                        {row.original.isComplete === false && (
                            <>
                                <Icon image={IncompleteSvg} className={styles.statusIcon} />
                                <span className={styles.incompleteStatus}>{INCOMPLETE}</span>
                            </>
                        )}
                        {row.original.isComplete === undefined && (
                            <>
                                <Icon image={OutdatedSvg} className={styles.statusIcon} />
                                <span className={styles.outdatedStatus}>{OUTDATED}</span>
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            id: "action",
            Header: "",
            Cell: ({ row }) => {
                return (
                    <div className={styles.conditionActionCell}>
                        <Button
                            icon={<EditIcon />}
                            iconPosition="right"
                            label={EDIT}
                            onClick={() => {
                                setSelectedConditionForEdit(row?.original);
                                setIsAddNewActivityDialogOpen(true);
                            }}
                            type="tertiary"
                            className={styles.buttonWithIcon}
                        />
                    </div>
                );
            },
        },
    ];

    const handleOnClose = useCallback(() => {
        setIsAddNewActivityDialogOpen(false);
    }, []);

    return (
        <div>
            <GlobalNav />
            <FinalExpenseContactBar backLink={`/finalexpenses/plans/${contactId}`} label={HEADER_TITLE} />
            <div className={styles.pageContainerWrapper}>
                <div className={styles.pageContainer}>
                    <h3 className={styles.conditionsLabel}>{CARD_TITLE}</h3>
                    <ContactSectionCard
                        title={CONDITIONS}
                        infoIcon={`(${healthConditions?.length})`}
                        className={styles.activitiesContainer}
                        contentClassName={styles.activitiesContainer_content}
                        actions={<div className="actions">{sectionHeaderChildren()}</div>}
                    >
                        <Table initialState={{}} data={healthConditions} columns={columns} />
                    </ContactSectionCard>
                    <div className={styles.disclaimerText}>{DISCLAIMER_TEXT}</div>
                    <Button
                        label={VIEW_QUOTE}
                        onClick={onClickViewQuote}
                        type="primary"
                        icon={<ButtonCircleArrow />}
                        fullWidth={true}
                        iconPosition="right"
                        style={{ border: "none" }}
                        className={styles.nextButton}
                    />
                </div>
            </div>

            <GlobalFooter />
            {isAddNewActivityDialogOpen && (
                <AddNewConditionDialog
                    open={isAddNewActivityDialogOpen}
                    selectedConditionForEdit={selectedConditionForEdit}
                    onClose={handleOnClose}
                    setHealthConditions={setHealthConditions}
                    refetchConditionsList={getHealthConditionsListData}
                />
            )}
        </div>
    );
};

export default FinalExpenseHealthConditionsContainer;
