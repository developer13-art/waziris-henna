export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[0-9+\-\s()]{10,20}$/
  return re.test(phone)
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateBookingForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.customer_name)) {
    errors.customer_name = 'Name is required'
  }

  if (!validateRequired(formData.customer_phone)) {
    errors.customer_phone = 'Phone number is required'
  } else if (!validatePhone(formData.customer_phone)) {
    errors.customer_phone = 'Invalid phone number'
  }

  if (formData.customer_email && !validateEmail(formData.customer_email)) {
    errors.customer_email = 'Invalid email address'
  }

  if (!validateRequired(formData.service_id)) {
    errors.service_id = 'Please select a service'
  }

  if (!validateRequired(formData.event_date)) {
    errors.event_date = 'Event date is required'
  }

  return errors
}

export const validateOrderForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.customer_name)) {
    errors.customer_name = 'Name is required'
  }

  if (!validateRequired(formData.customer_email)) {
    errors.customer_email = 'Email is required'
  } else if (!validateEmail(formData.customer_email)) {
    errors.customer_email = 'Invalid email address'
  }

  if (!validateRequired(formData.customer_phone)) {
    errors.customer_phone = 'Phone number is required'
  } else if (!validatePhone(formData.customer_phone)) {
    errors.customer_phone = 'Invalid phone number'
  }

  return errors
}