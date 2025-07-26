// utils/emailTemplates.js

export const welcomeEmailTemplate = (email, websiteUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center" style="font-size: 24px; color: #333333; font-weight: bold;">
              Welcome to Our Community!
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 16px; color: #555555; line-height: 1.6; padding: 20px 0;">
              We're excited to have you on board. Your account has been created with the email: <strong>${email}</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${websiteUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">Visit Our Site</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 14px; color: #999999; padding-top: 20px;">
              Thank you for joining us! Need help? Contact our support team.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const otpEmailTemplate = (otp, websiteUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e0eafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e0eafc">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td align="center" style="font-size: 16px; color: #4a4a4a; line-height: 1.6;">
              Thank you for joining us! Please use the OTP below to verify your account:
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f8ff; border-left: 5px solid #28a745; padding: 20px; border-radius: 8px;">
                <tr>
                  ${otp
                    .split('')
                    .map(
                      (digit) => `
                        <td style="padding: 0 5px;">
                          <div style="width: 40px; height: 50px; background-color: #ffffff; border: 2px solid #28a745; border-radius: 8px; font-size: 24px; font-weight: bold; color: #28a745; text-align: center; line-height: 50px;">
                            ${digit}
                          </div>
                        </td>
                      `
                    )
                    .join('')}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 16px; color: #4a4a4a; line-height: 1.6;">
              This OTP is valid for 24 hours. Enter it on our website to complete your account verification.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${websiteUrl}/verify" style="display: inline-block; padding: 12px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 25px;">Verify Now</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 14px; color: #6c757d; padding-top: 20px;">
              Need help? Contact our support team!
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const resetPasswordEmailTemplate = (otp, websiteUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e0eafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e0eafc">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td align="center" style="font-size: 16px; color: #4a4a4a; line-height: 1.6;">
              You requested to reset your password. Please use the OTP below to proceed:
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f8ff; border-left: 5px solid #dc3545; padding: 20px; border-radius: 8px;">
                <tr>
                  ${otp
                    .split('')
                    .map(
                      (digit) => `
                        <td style="padding: 0 5px;">
                          <div style="width: 40px; height: 50px; background-color: #ffffff; border: 2px solid #dc3545; border-radius: 8px; font-size: 24px; font-weight: bold; color: #dc3545; text-align: center; line-height: 50px;">
                            ${digit}
                          </div>
                        </td>
                      `
                    )
                    .join('')}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 16px; color: #4a4a4a; line-height: 1.6;">
              This OTP is valid for 15 minutes. Enter it on our website to reset your password.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${websiteUrl}/reset-password" style="display: inline-block; padding: 12px 30px; background-color: #dc3545; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 25px;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="font-size: 14px; color: #6c757d; padding-top: 20px;">
              If you didn’t request this, please ignore this email or contact our support team.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;