# Email Service Setup Guide (Nodemailer)

## Step 1: Choose Your Email Provider

### Option A: Zoho Mail (Recommended for Business)
1. **Log into your Zoho Mail account** (e.g., bitscartel.io domain)
2. **Go to Settings** → **Mail Accounts**
3. **Use these settings**:
   - Host: `smtp.zoho.com`
   - Port: `587` (TLS) or `465` (SSL)
   - Secure: `false` for port 587, `true` for port 465
   - User: `your_email@bitscartel.io`
   - Pass: Your Zoho Mail password

### Option B: Gmail (Good for Development)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Use these settings**:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Secure: `false`

### Option C: Outlook/Hotmail
- Host: `smtp-mail.outlook.com`
- Port: `587`
- Secure: `false`

### Option D: Custom SMTP Server
- Use your own SMTP server settings
- Common ports: `587` (TLS) or `465` (SSL)

## Step 2: Set Environment Variables

Create a `.env` file in your server directory with the following variables:

### For Zoho Mail (bitscartel.io):
```env
# Nodemailer Configuration for Zoho Mail
EMAIL_FROM=noreply@bitscartel.io
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@bitscartel.io
SMTP_PASS=your_zoho_password_here
```

### For Gmail:
```env
# Nodemailer Configuration for Gmail
EMAIL_FROM=noreply@bitshub.co
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

## Step 3: Test Email Configuration

After setting up the environment variables:

1. **Restart your server** to load the new environment variables
2. **Test the configuration** by calling:
   ```
   GET https://api-dev.bitsgiga.com/v1/dev/store/test-email-config
   ```
3. **Create a test store** to see if emails are sent

## Step 4: Verify Email Sending

Once configured, when you create a store:
- Admin email will be sent to: `bitshubitsolutions@gmail.com`
- User email will be sent to the user's email address
- Check your Zoho Mail sent folder for delivery status

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**:
   - Make sure you're using the correct Zoho Mail password
   - If 2FA is enabled, you might need to generate an app-specific password

2. **"Connection timeout" error**:
   - Check your firewall settings
   - Verify the SMTP host and port are correct
   - Try port 465 with `SMTP_SECURE=true` if 587 doesn't work

3. **"Authentication failed" error**:
   - Double-check your email and password
   - Ensure your Zoho Mail account is active

4. **"Relay access denied" error**:
   - Check if your Zoho Mail account allows SMTP access
   - Contact Zoho support if needed

### Testing Steps:

1. **Check environment variables**: Use the test endpoint
2. **Check server logs**: Look for Nodemailer-related messages
3. **Test connection**: The system will verify SMTP connection on startup
4. **Check email templates**: Ensure HTML templates are properly formatted

## Current Status

- ✅ Nodemailer integration implemented
- ✅ Email templates ready (admin and user notifications)
- ✅ Smart configuration detection
- ✅ Comprehensive error handling and logging
- ⏳ Environment variables need to be configured
- ⏳ Email provider setup required

## Example Configuration

### Zoho Mail Example (bitscartel.io):
```env
EMAIL_FROM=noreply@bitscartel.io
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@bitscartel.io
SMTP_PASS=your_zoho_password
```

### Gmail Example:
```env
EMAIL_FROM=noreply@bitshub.co
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourname@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

### Outlook Example:
```env
EMAIL_FROM=noreply@bitshub.co
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourname@outlook.com
SMTP_PASS=your_password
``` 