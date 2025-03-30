import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import Home from './Home.svg';
import Lead from './Lead.svg';
import LeadSource from './LeadSource.svg';
import Check from './Check.svg';
import './renderModalItem.scss';
import Arrow from 'components/icons/right-arrow';
import FooterButtons from 'packages/FooterButtons';
import { Button } from 'packages/Button';
import Mobile from './Mobile.svg';
import { Formik, Form } from 'formik';
import Textfield from 'components/ui/textfield';
import validationService from 'services/validationService';
import { formatPhoneNumber } from 'utils/phones';
import Editicon from 'components/icons/edit-details';
import { useClientServiceContext } from 'services/clientServiceProvider';
import useToast from 'hooks/useToast';
import useUserProfile from 'hooks/useUserProfile';

const CallCenterContent = ({
  agentId,
  phone,
  cancelButton,
  continueButton,
  callForwardNumber,
  getAgentAvailability,
}) => {
  const showToast = useToast();
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const { clientsService } = useClientServiceContext();
  const phoneNumber = callForwardNumber || phone;

  return (
    <>
      <Formik
        initialValues={{
          phone: phoneNumber,
        }}
        validate={values => {
          const error = validationService.validatePhone(values.phone);
          if (!error) {
            return null;
          }
          return {
            phone: error,
          };
        }}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          const phone = values.phone.replace(/[()\s-]/g, '');
          setSubmitting(true);
          try {
            await clientsService.updateAgentCallForwardingNumber({
              callForwardNumber: `${phone}`,
              agentID: agentId,
            });
            getAgentAvailability(agentId);
            showToast({
              message: 'Contact number updated succesfully',
            });
          } catch (error) {
            showToast({
              type: 'error',
              message: 'Failed to update the contact',
            });
            Sentry.captureException(error);
          }
          setIsEditingNumber(false);
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <Form>
              <div className='modalItemStyle bb '>
                <div className='editPhoneContainer'>
                  {isEditingNumber && (
                    <Textfield
                      id='contact-phone'
                      type='tel'
                      placeholder='(XXX) XXX-XXXX'
                      name='phone'
                      value={formatPhoneNumber(values.phone)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && errors.phone}
                    />
                  )}
                  {errors.phone && <div className='mb-3' />}
                  {!isEditingNumber && (
                    <div className='editPhone'>
                      <span className='number'>{values.phone}</span>
                      <span onClick={() => setIsEditingNumber(true)}>
                        <Editicon />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className='modalItemStyle'>
                <FooterButtons
                  buttonOne={cancelButton}
                  buttonTwo={
                    isEditingNumber
                      ? {
                          text: 'Save',
                          onClick: handleSubmit,
                          disabled: errors.phone,
                        }
                      : continueButton
                  }
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

const RenderModalItem = ({
  checkInPreference,
  agentId,
  handleClick,
  activeModal,
  handleButtonClick,
  phone,
  handlePreferences,
  preferences,
  isAvailable,
  callForwardNumber,
  getAgentAvailability,
}) => {
  const [callHover, setCallHover] = useState('');
  const [dataHover, setDataHover] = useState('');
  const [lcHover, setlcHover] = useState('');
  const [mcHover, setmcHover] = useState('');
  const userProfile = useUserProfile();
  const { npn } = userProfile;
  const {
    data = false,
    call = false,
    leadCenter = false,
    medicareEnrollPurl = false,
  } = preferences;
  const BUTTONS = {
    cancel: {
      text: 'Cancel',
      onClick: () => {
        handleClick('main');
      },
      disabled: false,
    },
    checkOut: {
      text: 'Check Out',
      onClick: () => {
        handleButtonClick('checkOut');
      },
      disabled: !isAvailable || (!call && !data),
    },
    continue: {
      text: 'Continue',
      onClick: () => {
        handleButtonClick('continue');
      },
      disabled: false,
    },
    checkIn: {
      text: 'Check In',
      disabled: !call && !data,
      onClick: () => {
        handleButtonClick('continue');
      },
    },
  };

  const renderContent = () => {
    switch (activeModal) {
      case 'callCenter':
        return (
          <CallCenterContent
            phone={phone}
            cancelButton={BUTTONS.cancel}
            continueButton={BUTTONS.checkIn}
            agentId={agentId}
            callForwardNumber={callForwardNumber}
            getAgentAvailability={getAgentAvailability}
          />
        );
      case 'leadType':
        return (
          <>
            <div
              className={`modalItemStyle bb  ${callHover ? 'bg' : ''}`}
              onMouseEnter={() => setCallHover(true)}
              onMouseLeave={() => setCallHover(false)}
              onClick={() => {
                handlePreferences('call', !call);
              }}
            >
              <img src={Home} alt='icon' className='modalItemImgStyle' />
              <div className='modalItemTextStyle'>
                <span className='.span_source-title'>Call Lead</span>
              </div>

              {call && (
                <img src={Check} alt='activeIcon' className='active_icon' />
              )}
            </div>

            <div
              className={`modalItemStyle bb  ${dataHover ? 'bg' : ''}`}
              onMouseEnter={() => setDataHover(true)}
              onMouseLeave={() => setDataHover(false)}
              onClick={() => {
                handlePreferences('data', !data);
              }}
            >
              <img className='modalItemImgStyle' alt='itemIcon' src={Lead} />
              <div className='modalItemTextStyle'>
                <span className='.span_source-title'>Data Lead</span>
              </div>
              {data && (
                <img src={Check} alt='activeIcon' className='active_icon' />
              )}
            </div>

            <div className='modalItemStyle'>
              <FooterButtons
                buttonOne={BUTTONS.cancel}
                buttonTwo={BUTTONS.checkIn}
              />
            </div>
          </>
        );
      case 'leadSource':
        return (
          <>
            <div
              className={`modalItemStyle bb  ${lcHover ? 'bg' : ''}`}
              onMouseEnter={() => setlcHover(true)}
              onMouseLeave={() => setlcHover(false)}
              onClick={() => {
                handlePreferences('leadCenter', !leadCenter);
              }}
            >
              <div className='modal-lead-source'>
                <div className='span_source-title'>LeadCENTER</div>
                <div className='span_setup'>
                  <Button
                    variant='primary'
                    size='small'
                    onClick={() =>
                      window.open(
                        `${
                          import.meta.env.VITE_AUTH0_LEADS_REDIRECT_URI
                        }/LeadCenterSSO`,
                        '_blank'
                      )
                    }
                  >
                    setup
                  </Button>
                </div>

                {leadCenter ? (
                  <img src={Check} alt='activeIcon' className='active_icon' />
                ) : (
                  <div className='active_icon'> </div>
                )}
              </div>
            </div>

            <div
              className={`modalItemStyle bb  ${mcHover ? 'bg' : ''}`}
              onMouseEnter={() => setmcHover(true)}
              onMouseLeave={() => setmcHover(false)}
              onClick={() => {
                handlePreferences('medicareEnrollPurl', !medicareEnrollPurl);
              }}
            >
              <div className='modal-lead-source'>
                <span className='span_source-title'>MedicareEnroll pURL</span>
                {medicareEnrollPurl && (
                  <img src={Check} alt='activeIcon' className='active_icon' />
                )}
              </div>
            </div>

            <div className='modalItemStyle'>
              <FooterButtons
                buttonOne={BUTTONS.cancel}
                buttonTwo={BUTTONS.checkIn}
              />
            </div>
          </>
        );
      case 'main':
        return (
          <>
            <div
              className='modalItemStyle bb'
              onClick={() => {
                handleClick('callCenter');
              }}
            >
              <img src={Mobile} alt='icon' className='modalItemImgStyle' />
              <div className='modalItemTextStyle'>
                <span className='span_title'>Call Number</span>
                <span className='span_type'>{callForwardNumber}</span>
              </div>
              <Arrow className='span_icon' />
            </div>

            <div
              className='modalItemStyle bb'
              onClick={() => {
                handleClick('leadType');
              }}
            >
              <img className='modalItemImgStyle' alt='itemIcon' src={Lead} />
              <div className='modalItemTextStyle'>
                <span className='span_title'>Lead Type</span>
                <span className='span_type'>
                  {((call && data) || (!call && !data)) && 'Call/Data'}
                  {call && !data && 'Call'}
                  {data && !call && 'Data'}
                </span>
              </div>
              <Arrow className='span_icon' />
            </div>

            <div
              className='modalItemStyle bb'
              onClick={() => {
                handleClick('leadSource');
              }}
            >
              <img
                className='modalItemImgStyle'
                alt='itemIcon'
                src={LeadSource}
              />
              <div className='modalItemTextStyle'>
                <span className='span_title'>Lead Source:</span>
                <span className='span_source_type'>
                  {((leadCenter && medicareEnrollPurl) ||
                    (!leadCenter && !medicareEnrollPurl)) &&
                    'LC/ME-pURL'}
                  {leadCenter && !medicareEnrollPurl && 'LeadCENTER'}
                  {medicareEnrollPurl && !leadCenter && 'MedicareEnroll'}
                </span>
              </div>
              <Arrow className='span_icon' />
            </div>
            {!checkInPreference && (
              <div className='modalItemStyle'>
                <FooterButtons
                  dashBoardModal={true}
                  buttonOne={BUTTONS.checkOut}
                  buttonTwo={BUTTONS.continue}
                />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };
  return <div className={`modalBox ${activeModal}-h`}>{renderContent()}</div>;
};
export default RenderModalItem;
