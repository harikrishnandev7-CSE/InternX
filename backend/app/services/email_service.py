import logging
from app.utils.email_provider import email_provider
from app.utils.email_templates import (
    get_student_welcome_template,
    get_company_welcome_template,
    get_company_approval_template,
    get_company_rejection_template,
    get_otp_template,
    get_password_changed_template,
    get_application_submitted_template,
    get_application_status_changed_template
)

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_student_welcome(to_email: str, name: str) -> bool:
        logger.info(f"Triggering student welcome email to {to_email}")
        try:
            html = get_student_welcome_template(name)
            success = email_provider.send_html_email(to_email, "Welcome to InternX 🎉", html)
            if success:
                logger.info(f"Welcome Email Sent successfully to Student: {to_email}")
            else:
                logger.error(f"Failed to send welcome email to student: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_student_welcome to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_company_welcome(to_email: str, name: str) -> bool:
        logger.info(f"Triggering company welcome email to {to_email}")
        try:
            html = get_company_welcome_template(name)
            success = email_provider.send_html_email(to_email, "Welcome to InternX – Account Pending Approval", html)
            if success:
                logger.info(f"Welcome Email Sent successfully to Company: {to_email}")
            else:
                logger.error(f"Failed to send welcome email to company: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_company_welcome to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_company_approval(to_email: str, name: str) -> bool:
        logger.info(f"Triggering company approval email to {to_email}")
        try:
            html = get_company_approval_template(name)
            success = email_provider.send_html_email(to_email, "Congratulations! Your account has been approved 🎉", html)
            if success:
                logger.info(f"Company Approved Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send approval email to company: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_company_approval to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_company_rejection(to_email: str, name: str) -> bool:
        logger.info(f"Triggering company rejection email to {to_email}")
        try:
            html = get_company_rejection_template(name)
            success = email_provider.send_html_email(to_email, "InternX Account Registration Status Update", html)
            if success:
                logger.info(f"Company Rejected Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send rejection email to company: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_company_rejection to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_otp_email(to_email: str, otp: str) -> bool:
        logger.info(f"Triggering OTP email to {to_email}")
        try:
            html = get_otp_template(otp)
            success = email_provider.send_html_email(to_email, "Reset Your Password - OTP Verification Code", html)
            if success:
                logger.info(f"OTP Generated and Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send OTP email to: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_otp_email to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_password_changed(to_email: str, name: str) -> bool:
        logger.info(f"Triggering password changed confirmation email to {to_email}")
        try:
            html = get_password_changed_template(name)
            success = email_provider.send_html_email(to_email, "Password Changed Successfully", html)
            if success:
                logger.info(f"Password Changed Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send password changed email to: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_password_changed to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_application_submitted(to_email: str, name: str, internship_title: str) -> bool:
        logger.info(f"Triggering application submitted email to {to_email}")
        try:
            html = get_application_submitted_template(name, internship_title)
            success = email_provider.send_html_email(to_email, "Application Submitted Successfully 🚀", html)
            if success:
                logger.info(f"Application Submitted Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send application submission email to: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_application_submitted to {to_email}: {str(e)}", exc_info=True)
            return False

    @staticmethod
    def send_application_status_changed(to_email: str, name: str, internship_title: str, status: str) -> bool:
        logger.info(f"Triggering application status changed email to {to_email}")
        try:
            html = get_application_status_changed_template(name, internship_title, status)
            success = email_provider.send_html_email(to_email, f"Application Status Updated: {status}", html)
            if success:
                logger.info(f"Application Status Email Sent successfully to {to_email}")
            else:
                logger.error(f"Failed to send status update email to student: {to_email}")
            return success
        except Exception as e:
            logger.error(f"Error in send_application_status_changed to {to_email}: {str(e)}", exc_info=True)
            return False
