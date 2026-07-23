import smtplib
import logging
from abc import ABC, abstractmethod
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, EMAIL_FROM

logger = logging.getLogger(__name__)

class EmailProvider(ABC):
    @abstractmethod
    def send_html_email(self, to_email: str, subject: str, html_body: str) -> bool:
        pass

class SMTPEmailProvider(EmailProvider):
    def send_html_email(self, to_email: str, subject: str, html_body: str) -> bool:
        if not SMTP_SERVER or not SMTP_EMAIL:
            logger.error("SMTP Configuration is incomplete. Unable to send email.")
            return False

        # Print config details before authentication (without exposing secrets)
        has_password = "Yes" if SMTP_PASSWORD else "No"
        print(f"\nSMTP_SERVER : {SMTP_SERVER}")
        print(f"SMTP_PORT   : {SMTP_PORT}")
        print(f"SMTP_EMAIL  : {SMTP_EMAIL}")
        print(f"PASSWORD    : Loaded {has_password}")
        print(f"EMAIL_FROM  : {EMAIL_FROM or SMTP_EMAIL}\n")

        logger.info(f"SMTP Config: Server={SMTP_SERVER}, Port={SMTP_PORT}, Email={SMTP_EMAIL}, Password_Loaded={has_password}, From={EMAIL_FROM}")

        try:
            msg = MIMEMultipart()
            msg["From"] = EMAIL_FROM or SMTP_EMAIL
            msg["To"] = to_email
            msg["Subject"] = subject

            msg.attach(MIMEText(html_body, "html"))

            port = int(SMTP_PORT) if SMTP_PORT else 587
            if port == 465:
                logger.info(f"Connecting to SMTP SSL server {SMTP_SERVER}:{port}...")
                server = smtplib.SMTP_SSL(SMTP_SERVER, port, timeout=10)
                logger.info("Connection successful. Sending EHLO...")
                server.ehlo()
            else:
                logger.info(f"Connecting to SMTP server {SMTP_SERVER}:{port}...")
                server = smtplib.SMTP(SMTP_SERVER, port, timeout=10)
                logger.info("Connection successful. Sending EHLO...")
                server.ehlo()
                logger.info("Sending STARTTLS...")
                server.starttls()
                logger.info("Sending EHLO post-STARTTLS...")
                server.ehlo()

            if SMTP_PASSWORD:
                logger.info("SMTP Login Starting...")
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                logger.info("SMTP Login Successful")
            else:
                logger.info("SMTP_PASSWORD is empty, skipping login")

            logger.info(f"Sending email to {to_email}...")
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
            logger.info("Email Sent Successfully")
            
            server.quit()
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication Error (BadCredentials): {str(e)}", exc_info=True)
            return False
        except smtplib.SMTPConnectError as e:
            logger.error(f"SMTP Connection Error: {str(e)}", exc_info=True)
            return False
        except smtplib.SMTPServerDisconnected as e:
            logger.error(f"SMTP Server Disconnected: {str(e)}", exc_info=True)
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP Error occurred: {str(e)}", exc_info=True)
            return False
        except TimeoutError as e:
            logger.error(f"SMTP Connection Timeout: {str(e)}", exc_info=True)
            return False
        except Exception as e:
            logger.error(f"Unexpected error in email provider: {str(e)}", exc_info=True)
            return False

email_provider = SMTPEmailProvider()
