import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV;

const variables = {
  app: {
    port: process.env.PORT || "3210",
    environment,
    clientUrl: process.env.CLIENT_URL,
    clientUrl2: process.env.CLIENT2_URL,
    clientDevUrl: process.env.CLIENT_DEV_URL,
    adminUrl: process.env.ADMIN_URL,
    adminDevUrl: process.env.ADMIN_DEV_URL,
    isDev: environment === 'development',
    isTesting: environment === 'test',
    isProd: environment === 'production',
    isStaging: environment === 'staging',
    baseRouter: process.env.BASE_ROUTER
  },

  services: {
    notification: {
      port: process.env.NOTIFICATION_SERVICE_PORT || process.env.PORT,
      environment,
      isDev: environment === 'development',
      isTesting: environment === 'test',
      isProd: environment === 'production',
      isStaging: environment === 'staging'
    },
    email: {
      baseUrl: process.env.EMAIL_SERVICE_BASE_URL,
      redirectUrl: process.env.EMAIL_SERVICE_REDIRECT_URL
    },
    elastic_search: {
      baseurl: process.env.ELASTIC_SEARCH_SERVICE_BASE_URL
    },
    rabbitmqUrl: process.env.RABBITMQ_URL
  },

  email: {
    from: process.env.EMAIL_FROM || 'noreply@bitscartel.io',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },

  auth: {
    secret: process.env.JWT_SECRET,
    adminKey: process.env.ADMIN_KEY,
    googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT
  },

  logs: {
    showAppLogs: process.env.SHOW_APPLICATION_LOGS === 'true',
    databaseLogs: process.env.SHOW_DATABASE_LOGS === 'true'
  },

  db: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    testDbName: process.env.TEST_DATABASE_NAME
  },

  integrations: {
    sendbox: {
      baseUrl: process.env.SENDBOX_BASE_URL,
      secretKey: process.env.SENDBOX_SECRET_KEY,
      appId: process.env.SENDBOX_APP_ID,
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2MzZkZTkyZTVlNGYzZjAwMGZiZjY4MzciLCJhaWQiOiI2MzZkZTk0NjVlNGYzZjAwMTliZjZhM2YiLCJ0d29fZmEiOmZhbHNlLCJpbnN0YW5jZV9pZCI6IjYxMzZkZmE2YTFhYjlkMzE4YmNmY2I5NCIsImlzcyI6InNlbmRib3guYXBwcy5hdXRoLTYxMzZkZmE2YTFhYjlkMzE4YmNmY2I5NCIsImV4cCI6MTY3MzI0NTM5MX0.gopTR1n21qSESjgRC2bJPBbqS-o2wVO_yObXvX8FPOM',
      refreshToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBsaWNhdGlvbiI6eyJwayI6IjYzNmRlOTQ2NWU0ZjNmMDAxOWJmNmEzZiIsImRlc2NyaXB0b24iOiJCYXphcmEiLCJuYW1lIjoiQmF6YXJhIn0sImFwcF9pZCI6IjYzNmRlOTQ2NWU0ZjNmMDAxOWJmNmEzZiIsImlzcyI6InNlbmRib3guYXBwcy5hdXRoIiwiZXhwIjoxNzAyNzA3NzkxfQ.jzv0f6V2x_UdWmLK5rz3ELU57tP2AhO3z2ihZTGSmsM'
    },
    aws: {
      s3: {
        secretKey: process.env.AWS_S3_SECRET_KEY,
        accessKey: process.env.AWS_S3_ACCESS_KEY
      }
    },
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    },
    webhook: {
      baseUrl: process.env.NOTIFICATION_SERVICE_BASE_URL,
      signatureAlgo: 'sha512',
      signatureDigest: 'hex'
    }
  },

  storage: {
    r2: {
      bucket: process.env.R2_BUCKET
    },
    upload: {
      allowedMime: (process.env.UPLOAD_ALLOWED_MIME || '').split(',').filter(Boolean)
    }
  },

  pusher: {
    key: process.env.PUSHER_KEY,
    appId: process.env.PUSHER_APP_ID,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER
  },

  transactions: {
    expiryTimeInMins: Number(process.env.TRANSACTION_EXPIRY_TIME_IN_MINS) || 30,
    processing_fee: Number(process.env.PROCESSING_FEE),
    disputeAmount: Number(process.env.DISPUTE_AMOUNT)
  },

  settlements: {
    fiat_settlement_fees: Number(process.env.FIAT_SETTLEMENT_FEES),
    crypto_settlement_fees: Number(process.env.CRYPTO_SETTLEMENT_FEES)
  }
};

export default variables;