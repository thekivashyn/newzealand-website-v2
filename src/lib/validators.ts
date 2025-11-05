// Form validation helpers
export interface ValidationRule {
  validator: (value: string, formData?: Record<string, string>) => boolean;
  message: string;
}

export interface FieldConfig {
  initialValue?: string;
  validations?: ValidationRule[];
}

export const validators = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validator: (value) => value.trim().length > 0,
    message,
  }),

  email: (message: string = 'Please enter a valid email'): ValidationRule => ({
    validator: (value) => /\S+@\S+\.\S+/.test(value),
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    validator: (value) => value.length >= length,
    message: message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    validator: (value) => value.length <= length,
    message: message || `Must be no more than ${length} characters`,
  }),

  matchesField: (fieldName: string, message: string = 'Fields do not match'): ValidationRule => ({
    validator: (value, formData) => value === formData?.[fieldName],
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validator: (value) => regex.test(value),
    message,
  }),

  custom: (validator: (value: string) => boolean, message: string): ValidationRule => ({
    validator,
    message,
  }),
};

// Validate field
export function validateField(
  fieldName: string,
  value: string,
  fieldConfig: FieldConfig,
  formData: Record<string, string>
): string | undefined {
  if (!fieldConfig?.validations) return undefined;

  for (const rule of fieldConfig.validations) {
    if (!rule.validator(value, formData)) {
      return rule.message;
    }
  }
  return undefined;
}

// Validate form
export function validateForm(
  fields: Record<string, FieldConfig>,
  formData: Record<string, string>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  Object.keys(fields).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName], fields[fieldName], formData);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

