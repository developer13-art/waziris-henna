<?php

namespace Helpers;

class Validator
{
    public static function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $fieldName = ucfirst(str_replace('_', ' ', $field));

            $rulesArray = explode('|', $fieldRules);

            foreach ($rulesArray as $rule) {
                $params = explode(':', $rule);
                $ruleName = $params[0];

                switch ($ruleName) {
                    case 'required':
                        if (empty($value) && $value !== '0') {
                            $errors[$field][] = "{$fieldName} is required";
                        }
                        break;

                    case 'email':
                        if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field][] = "{$fieldName} must be a valid email address";
                        }
                        break;

                    case 'phone':
                        if ($value && !preg_match('/^[0-9+\-\s()]{10,20}$/', $value)) {
                            $errors[$field][] = "{$fieldName} must be a valid phone number";
                        }
                        break;

                    case 'min':
                        $minLength = (int)($params[1] ?? 1);
                        if ($value && strlen($value) < $minLength) {
                            $errors[$field][] = "{$fieldName} must be at least {$minLength} characters";
                        }
                        break;

                    case 'max':
                        $maxLength = (int)($params[1] ?? 255);
                        if ($value && strlen($value) > $maxLength) {
                            $errors[$field][] = "{$fieldName} must not exceed {$maxLength} characters";
                        }
                        break;

                    case 'numeric':
                        if ($value && !is_numeric($value)) {
                            $errors[$field][] = "{$fieldName} must be a number";
                        }
                        break;

                    case 'date':
                        if ($value && !strtotime($value)) {
                            $errors[$field][] = "{$fieldName} must be a valid date";
                        }
                        break;

                    case 'in':
                        $allowedValues = explode(',', $params[1] ?? '');
                        if ($value && !in_array($value, $allowedValues)) {
                            $errors[$field][] = "{$fieldName} must be one of: " . implode(', ', $allowedValues);
                        }
                        break;
                }
            }
        }

        return $errors;
    }

    public static function validateOrFail(array $data, array $rules): void
    {
        $errors = self::validate($data, $rules);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }
    }
}