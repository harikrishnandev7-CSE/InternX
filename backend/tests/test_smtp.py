import sys
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load .env file
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, ".env")
print(f"Loading environment variables from: {env_path}")
load_dotenv(dotenv_path=env_path)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def run_smtp_test():
    # Trim quotes/whitespace
    def clean_val(val):
        if val is None:
            return ""
        return val.strip().strip('\'"')

    SMTP_SERVER = clean_val(os.getenv("SMTP_SERVER", "smtp.gmail.com"))
    SMTP_PORT = clean_val(os.getenv("SMTP_PORT", "587"))
    SMTP_EMAIL = clean_val(os.getenv("SMTP_EMAIL", ""))
    SMTP_PASSWORD = clean_val(os.getenv("SMTP_PASSWORD", ""))
    EMAIL_FROM = clean_val(os.getenv("EMAIL_FROM", ""))

    print("\n--- Diagnostic SMTP Configuration ---")
    print(f"SMTP_SERVER : {SMTP_SERVER}")
    print(f"SMTP_PORT   : {SMTP_PORT}")
    print(f"SMTP_EMAIL  : {SMTP_EMAIL}")
    print(f"PASSWORD    : Loaded {'Yes' if SMTP_PASSWORD else 'No'}")
    print(f"EMAIL_FROM  : {EMAIL_FROM}")
    print("--------------------------------------\n")

    if not SMTP_SERVER or not SMTP_EMAIL:
        print("[FAILURE] Root Cause: Configuration - Missing required SMTP fields in .env")
        sys.exit(1)

    port = int(SMTP_PORT) if SMTP_PORT else 587
    server = None

    try:
        # 1. Connection
        print("[Step 1] Connection: Connecting to SMTP server...")
        if port == 465:
            server = smtplib.SMTP_SSL(SMTP_SERVER, port, timeout=10)
        else:
            server = smtplib.SMTP(SMTP_SERVER, port, timeout=10)
        print("SUCCESS: Connected to SMTP server.")

        # 2. EHLO
        print("[Step 2] EHLO: Sending EHLO to SMTP server...")
        server.ehlo()
        print("SUCCESS: EHLO received.")

        # 3. STARTTLS
        if port != 465:
            print("[Step 3] STARTTLS: Upgrading to TLS connection...")
            server.starttls()
            print("SUCCESS: STARTTLS negotiation completed.")

            # 4. EHLO Post STARTTLS
            print("[Step 4] EHLO: Sending EHLO post-STARTTLS...")
            server.ehlo()
            print("SUCCESS: EHLO post-STARTTLS received.")
        else:
            print("[Steps 3 & 4] Skipping STARTTLS (Direct SSL/TLS Connection).")

        # 5. Authentication
        print("[Step 5] Authentication: Logging into SMTP server...")
        if not SMTP_PASSWORD:
            print("[FAILURE] Root Cause: Configuration - Password not set in .env")
            sys.exit(1)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        print("SUCCESS: Authentication successful.")

        # 6. Send Mail
        print("[Step 6] Send Mail: Sending diagnostic test HTML email...")
        msg = MIMEMultipart()
        msg["From"] = EMAIL_FROM or SMTP_EMAIL
        msg["To"] = SMTP_EMAIL
        msg["Subject"] = "InternX SMTP Diagnostic Success 🎉"
        body = """
        <h3>SMTP Connection Working Successfully!</h3>
        <p>This is a diagnostic email from InternX showing that SMTP has been configured correctly.</p>
        """
        msg.attach(MIMEText(body, "html"))
        server.sendmail(SMTP_EMAIL, SMTP_EMAIL, msg.as_string())
        print("SUCCESS: Email sent successfully.")

        # 7. Quit
        print("[Step 7] Quit: Closing connection...")
        server.quit()
        print("SUCCESS: Disconnected successfully.")
        print("\n=== DIAGNOSTIC SMTP TEST PASSED SUCCESSFULLY ===")

    except (smtplib.SMTPConnectError, TimeoutError) as e:
        print(f"\n[FAILURE] Stage: Connection. Error: {str(e)}")
        print("Potential Root Causes:")
        print("- Network: Server or port is blocked by firewall/ISP.")
        print("- Configuration: SMTP_SERVER or SMTP_PORT settings are wrong.")
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n[FAILURE] Stage: Authentication. Error: {str(e)}")
        print("Potential Root Causes:")
        print("- Google Authentication / App Password: You must use a 16-character App Password, NOT your regular Gmail password.")
        print("- Configuration: The SMTP_EMAIL or SMTP_PASSWORD in backend/.env is incorrect.")
    except smtplib.SMTPServerDisconnected as e:
        print(f"\n[FAILURE] Stage: STARTTLS/Protocol. Error: {str(e)}")
        print("Potential Root Causes:")
        print("- Network/Protocol: Server disconnected unexpectedly. Check if port matches security constraints.")
    except smtplib.SMTPException as e:
        print(f"\n[FAILURE] Stage: SMTP Protocol. Error: {str(e)}")
        print("Potential Root Causes:")
        print("- Protocol/Network: General SMTP error during EHLO/STARTTLS handshake.")
    except Exception as e:
        print(f"\n[FAILURE] Stage: Unexpected. Error: {str(e)}")
    finally:
        if server:
            try:
                server.close()
            except:
                pass

if __name__ == "__main__":
    run_smtp_test()
