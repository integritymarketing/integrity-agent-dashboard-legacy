import React from "react";
import BaseLegalPage from "pages/BaseLegalPage";

const PrivacyPolicyPage = () => {
    return (
        <BaseLegalPage title="Privacy Policy" showIntegrity={true}>
            <p className="text-body text-body--large mb-4">
                <strong>Please read this privacy policy carefully.</strong>
            </p>
            <div className="wysiwyg">
                <h3>Introduction</h3>
                <p>
                    Welcome to our Website. Your privacy is very important to us and we
                    will make every reasonable effort to safeguard any information we
                    collect. The purpose of this Internet Privacy Policy is to let you
                    know how we handle the information we receive from you through this
                    Website. This Internet Privacy Policy does not apply to information
                    collected through other means such as by telephone or in-person,
                    although that information may be protected by other privacy policies.
                </p>

                <h3>HIPAA Notice of Privacy Practices</h3>
                <p>
                    The Health Insurance Portability and Accountability Act of 1996
                    (HIPAA) Privacy Rule allows members the right to receive a notice that
                    describes how individual health information may be used and/or
                    disclosed and how to acquire access to this information. To read more
                    about our privacy practices regarding health and medical information
                    under HIPAA, please see our Website. In the event of any conflict
                    between the requirements and/or permitted uses of covered health and
                    medical information under our HIPAA Notice of Privacy Practices and
                    this Internet Privacy Policy, the terms of our HIPAA Notice of Privacy
                    Practices shall control.
                </p>

                <h3>What Information Do We Collect</h3>
                <p>
                    Information may be collected in two ways on our Website. You may elect
                    to establish an account on our Website so that you can gain additional
                    access to on-line service applications, health tools health
                    information, subscriptions or other services where it is important for
                    us to know who you are in order to best meet your needs. Personal
                    information will not be collected from you without your knowledge.
                </p>
                <p>
                    Providing this personal information is always voluntary. Second, we
                    may use "cookies" to help us improve our Website by tracking your
                    navigation habits and to store some of your preferences. A cookie is a
                    small file created by an Internet site to store information on your
                    computer. This cookie does not allow other Websites to gain access to
                    information on your computer. Only our Website can read this cookie.
                </p>

                <h3>Linking to Other Websites</h3>
                <p>
                    From time to time we will provide links to other Websites, not owned
                    or controlled by us. We do this because we think this information
                    might be of interest or use to you or where, as a member, we can
                    provide you with value added services. While we do our best to ensure
                    your privacy, we cannot be responsible for the privacy practices of
                    other sites. A link to an external Website does not constitute or
                    imply endorsement by us. Additionally, we cannot guarantee the quality
                    or accuracy of information presented on external Websites. We
                    encourage you to review the privacy practices of any Website you
                    visit.
                </p>

                <h3>Use of Electronic Mail</h3>
                <p>
                    Most E-mail, including the E-mail functionality on our Website, does
                    not provide a completely secure and confidential means of
                    communication. It is possible that your E-mail communication may be
                    accessed or viewed inappropriately by another Internet user while in
                    transit to us. If you wish to keep your information completely
                    private, you should not use E-mail.
                </p>

                <h3>Other Online Communications</h3>
                <p>
                    We may send electronic newsletters, notification of account status,
                    and other communications such as information marketing other products
                    or services, on a periodic basis to various individuals and
                    organizations. To opt-out of any specific electronic communication
                    you're receiving, click on the opt-out button associated with the
                    specific communication.
                </p>

                <h3>Changes to This Privacy Policy</h3>
                <p>
                    We may change this Privacy Policy or our Terms of Use from time to
                    time. If we do so such change will appear on this page of our Website.
                    It is your responsibility to review the Privacy Policy when you use
                    this Website. By continuing to use this Website you consent to any
                    changes to our Privacy Policy or Terms of Use. This statement is not
                    intended to and does not create any contractual of other legal right
                    in or on behalf of any party.
                </p>
            </div>
        </BaseLegalPage>
    );
};

export default PrivacyPolicyPage;
