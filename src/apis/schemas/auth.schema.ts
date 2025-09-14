import { celebrate, Joi, Segments } from 'celebrate';

export const registerUserSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      first_name: Joi.string().required().trim().messages({
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      last_name: Joi.string().required().trim().messages({
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': `{{#label}} should be a valid email`,
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      password: Joi.string().required().trim().min(8).max(25).messages({
        'string.min': `{{#label}} should be a minimum of 8 characters`,
        'string.max': `{{#label}} should be a maximum of 25 characters`,
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      phone_number: Joi.string().trim()
    })
  },
  {
    abortEarly: false
  }
);

export const registerAppleSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      identity_token: Joi.string().required().trim(),
      given_name: Joi.string().required().trim(),
      family_name: Joi.string().required().trim(),
      user: Joi.string().required().trim()
    })
  },
  {
    abortEarly: false
  }
);

export const authAppleSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      identity_token: Joi.string().required().trim(),
      user: Joi.string().required().trim()
    })
  },
  {
    abortEarly: false
  }
);

export const updateUserSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      first_name: Joi.string().trim().messages({
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      last_name: Joi.string().trim().messages({
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      email: Joi.string().email().trim().lowercase().messages({
        'string.email': `{{#label}} should be a valid email`,
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      phone_number: Joi.string().trim(),
      img_url: Joi.string().trim(),
      mobile: Joi.string().trim(),
      profile_cover_img: Joi.string().trim(),
      sex: Joi.string().trim()
    })
  },
  {
    abortEarly: false
  }
);

export const loginSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required().trim().lowercase().messages({
        'string.email': `{{#label}} should be a valid email`,
        'string.empty': `{{#label}} is not allowed to be empty`
      }),
      password: Joi.string().required().trim().min(6).max(25).messages({
        'string.min': `{{#label}} should be a minimum of 6 characters`,
        'string.max': `{{#label}} should be a maximum of 25 characters`,
        'string.empty': `{{#label}} is not allowed to be empty`
      })
    })
  },
  {
    abortEarly: false
  }
);

export const requestPasswordResetSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required().trim().lowercase().messages({
      'string.email': `{{#label}} should be a valid email`,
      'string.empty': `{{#label}} is not allowed to be empty`
    }),
    redirect_url: Joi.string().required().trim().messages({
      'string.empty': `{{#label}} is not allowed to be empty`
    })
  })
});

export const resetPasswordResetSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required().trim().messages({
      'string.empty': `{{#label}} is not allowed to be empty`
    }),
    password: Joi.string().required().trim().messages({
      'string.empty': `{{#label}} is not allowed to be empty`
    })
  })
});
