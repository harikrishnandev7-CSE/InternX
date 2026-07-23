from datetime import datetime

def get_shared_layout(content_html: str) -> str:
    current_year = datetime.utcnow().year
    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #1f2937;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }}
        .header {{
            background-color: #2563eb;
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
        }}
        .logo-placeholder {{
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 12px;
            color: #ffffff;
        }}
        .content {{
            padding: 40px 30px;
            line-height: 1.6;
            font-size: 16px;
        }}
        .content h2 {{
            color: #111827;
            margin-top: 0;
            font-size: 20px;
            font-weight: 600;
        }}
        .btn {{
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            margin-top: 20px;
            text-align: center;
        }}
        .btn:hover {{
            background-color: #1d4ed8;
        }}
        .footer {{
            background-color: #f9fafb;
            padding: 24px 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }}
        .footer a {{
            color: #2563eb;
            text-decoration: none;
        }}
        .otp-code {{
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 6px;
            color: #2563eb;
            background: #eff6ff;
            padding: 12px 24px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px dashed #bfdbfe;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-placeholder">InternX 💼</div>
            <h1>Internship Management System</h1>
        </div>
        <div class="content">
            {content_html}
        </div>
        <div class="footer">
            <p>Need help? Contact our support team at <a href="mailto:support@internx.com">support@internx.com</a></p>
            <p>&copy; {current_year} InternX. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""

def get_student_welcome_template(name: str) -> str:
    content = f"""
    <h2>Welcome to InternX, {name}! 🎉</h2>
    <p>Your account has been successfully created. We are excited to have you on board.</p>
    <p>You can now log in to your account and perform the following actions:</p>
    <ul>
        <li>Browse Internships matching your profile</li>
        <li>Apply to opportunities in one click</li>
        <li>Track your application statuses in real-time</li>
    </ul>
    <p>Kickstart your journey by completing your profile and adding your skills.</p>
    <a href="http://localhost:5173/login" class="btn">Explore Internships</a>
    """
    return get_shared_layout(content)

def get_company_welcome_template(name: str) -> str:
    content = f"""
    <h2>Welcome to InternX, {name}!</h2>
    <p>Thank you for registering your company with InternX.</p>
    <p><strong>Please Note:</strong> Your account is currently pending administrator review. We will verify your company details and notify you once your account has been approved.</p>
    <p>Once approved, you will be able to post internship opportunities, view applicants, and select candidates.</p>
    """
    return get_shared_layout(content)

def get_company_approval_template(name: str) -> str:
    content = f"""
    <h2>Congratulations, {name}! 🎉</h2>
    <p>Your company account on InternX has been <strong>approved</strong> by our administrator.</p>
    <p>You can now log in, post internships, manage applications, and interact with students.</p>
    <a href="http://localhost:5173/login" class="btn">Post an Internship</a>
    """
    return get_shared_layout(content)

def get_company_rejection_template(name: str) -> str:
    content = f"""
    <h2>Account Status Update</h2>
    <p>Hello {name},</p>
    <p>We regret to inform you that your registration request for InternX has been rejected after administrator review.</p>
    <p>If you believe this was an error, please reach out to our support team at <a href="mailto:support@internx.com">support@internx.com</a>.</p>
    """
    return get_shared_layout(content)

def get_otp_template(otp: str) -> str:
    content = f"""
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Use the verification code below to complete the process:</p>
    <div style="text-align: center;">
        <span class="otp-code">{otp}</span>
    </div>
    <p><strong>This code will expire in 5 minutes.</strong> If you did not make this request, you can safely ignore this email.</p>
    """
    return get_shared_layout(content)

def get_password_changed_template(name: str) -> str:
    content = f"""
    <h2>Password Changed Successfully</h2>
    <p>Hello {name},</p>
    <p>This is a confirmation email that the password for your InternX account was recently changed.</p>
    <p>If you made this change, no action is required.</p>
    <p><strong>Important:</strong> If you did not change your password, please contact support immediately to secure your account.</p>
    """
    return get_shared_layout(content)

def get_application_submitted_template(name: str, internship_title: str) -> str:
    content = f"""
    <h2>Application Submitted! 🚀</h2>
    <p>Hello {name},</p>
    <p>Your application for the internship <strong>"{internship_title}"</strong> has been successfully submitted.</p>
    <p>The company will review your application soon. You can track the status of your applications anytime on your student dashboard.</p>
    <a href="http://localhost:5173/student/applications" class="btn">Track Application</a>
    """
    return get_shared_layout(content)

def get_application_status_changed_template(name: str, internship_title: str, status: str) -> str:
    status_colors = {{
        "Under Review": "#f59e0b",
        "Shortlisted": "#3b82f6",
        "Selected": "#10b981",
        "Rejected": "#ef4444"
    }}
    color = status_colors.get(status, "#1f2937")
    
    content = f"""
    <h2>Application Status Update</h2>
    <p>Hello {name},</p>
    <p>The status of your application for the internship <strong>"{internship_title}"</strong> has been updated to:</p>
    <div style="margin: 20px 0; font-size: 18px; font-weight: 600; color: {color};">
        {status}
    </div>
    <p>Please check your student dashboard for details.</p>
    <a href="http://localhost:5173/student/applications" class="btn">View Details</a>
    """
    return get_shared_layout(content)
