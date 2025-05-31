import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    base_url: process.env.BASE_URL,
    default_pass: process.env.DEFAULT_PASS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    google_api_key: process.env.GOOGLE_API_KEY,
    stripe: {
        stripe_secret_key: process.env.STRIPE_SECRET_KEY,
        webhook_endpoint_secret: process.env.WEBHOOK_ENDPOINT_SECRET,
        connected_account_webhook_secret:
            process.env.CONNECTED_ACCOUNT_WEBHOOK_SECRET,
        onboarding_return_url: process.env.ONBOARDING_RETURN_URL,
        onboarding_refresh_url: process.env.ONBOARDING_REFRESH_URL,
        subscription_payment_success_url:
            process.env.STRIPE_SUBSCRIPTION_PURCHASE_SUCCESS_URL,
        subscription_payment_cancel_url:
            process.env.STRIPE_SUBSCRIPTION_PURCHASE_CANCEL_URL,
        subscription_renew_success_url:
            process.env.STRIPE_SUBSCRIPTION_RENEW_SUCCESS_URL,
        subscription_renew_cancel_url:
            process.env.STRIPE_SUBSCRIPTION_RENEW_CANCEL_URL,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    smtp: {
        smtp_host: process.env.SMTP_HOST,
        smtp_port: process.env.SMTP_PORT,
        smtp_service: process.env.SMTP_SERVICE,
        smtp_mail: process.env.SMTP_MAIL,
        smtp_pass: process.env.SMTP_PASS,
        name: process.env.SERVICE_NAME,
    },
    AI: {
        groq_model: process.env.GROQ_MODEL,
        groq_api_url: process.env.GROQ_API_URL,
        groq_api_key: process.env.GROQ_API_KEY,
        open_ai_model: process.env.OPENAI_MODEL,
        open_ai_url: process.env.OPENAI_API_URL,
        open_ai_api_key: process.env.OPENAI_API_KEY,
    },
};
