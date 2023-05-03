import { useEffect, useState } from 'react';
import { FormField } from '../../components/FormFields/FormField';
import {
  accountOptions,
  allowedFileTypes,
  monthYearOptions,
  transactionTypeOptions,
} from '../../utils/constants';
import { getFormattedName } from '../../utils/helper';
import { getById, save } from './requests/transactionRequests';
import { useNavigate, useParams } from 'react-router-dom';

const initialValues = {
  id: '',
  date: '',
  month_year: '',
  type: '',
  from_account: '',
  to_account: '',
  amount: '',
  receipt: '',
  receipt_obj: '',
  notes: '',
};

const validationSchema = {
  date: {
    type: 'date',
    rules: {
      required: true,
    },
  },
  month_year: {
    rules: {
      required: true,
    },
  },
  type: {
    rules: {
      required: true,
    },
  },
  from_account: {
    rules: {
      required: true,
    },
  },
  to_account: {
    rules: {
      required: true,
      validateAccount: (fromAccount, toAccount) => {
        return fromAccount && toAccount && fromAccount === toAccount
      }
    },
  },
  amount: {
    type: 'number',
    rules: {
      required: true,
      max: 10000,
    },
  },
  receipt: {
    type: 'file',
    rules: {
      validateExt: (file) => {
        return file && !allowedFileTypes.includes(file.type)
      },
      validateSize: (file) => file && file.size > (1024 * 1024 * 5), // 5 mb
      required: true,
    },
  },
  notes: {
    rules: {
      required: true,
      max: 250,
    },
  },
};

const FieldWrapper = ({ setValues, ...rest }) => (
  <FormField
    {...rest}
    onChange={(value) => {
      setValues((old) => ({ ...old, [rest.name]: value }));
    }}
  />
);

export const TransactionForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const validateFormValues = () => {
    const tempErrors = { ...errors };
    Object.keys(validationSchema).forEach((field) => {
      const errors = getFieldErrors(validationSchema[field], field);
      if (errors.length) {
        tempErrors[field] = errors;
      } else {
        // delete field errors if exists
        if (tempErrors[field]) {
          delete tempErrors[field];
        }
      }
    });
    setErrors(tempErrors);
    return tempErrors;
  };

  const getFieldErrors = (fieldInfo, fieldName) => {
    return (
      Object.keys(fieldInfo['rules'])
        .map((ruleType) => {
          switch (ruleType) {
            case 'min':
              return validateMin(
                fieldInfo['rules'][ruleType],
                getFormattedName(fieldName),
                values[fieldName],
                fieldInfo['type']
              );
            case 'max':
              return validateMax(
                fieldInfo['rules'][ruleType],
                getFormattedName(fieldName),
                values[fieldName],
                fieldInfo['type']
              );
            case 'validateAccount':
              return fieldInfo['rules'][ruleType](values.from_account, values.to_account) && 'From account and to account cannot be same';
            case 'validateExt':
              return fieldInfo['rules'][ruleType](values.receipt_obj) && 'Only .jpg, .png or .jpeg files are allowed';
            case 'validateSize':
              return fieldInfo['rules'][ruleType](values.receipt_obj) && `Receipt should under 5 mb in size`;
            default:
              // required
              return (
                !values[fieldName].trim() &&
                `${getFormattedName(fieldName)} is required`
              );
          }
        })
        // remove false items from the validation messages
        .filter((item) => item)
    );
  };

  const validateMax = (ruleValue, fieldName, fieldValue, fieldType) => {
    switch (fieldType) {
      case 'file':
        return (
          fieldValue.size > ruleValue &&
          `${fieldName} size cannot exceed ${ruleValue} KB`
        );
      case 'number':
        return (
          fieldValue > ruleValue &&
          `${fieldName} cannot exceed ${ruleValue} INR`
        );
      default:
        // for rest of the fields
        return (
          fieldValue.length > ruleValue &&
          `${fieldName} cannot exceed ${ruleValue} in length`
        );
    }
  };

  const validateMin = (ruleValue, fieldName, fieldValue, fieldType) => {
    switch (fieldType) {
      case 'file':
        return (
          fieldValue.size < ruleValue &&
          `${fieldName} size should be atleast ${ruleValue} KB`
        );
      case 'number':
        return (
          fieldValue < ruleValue &&
          `${fieldName} should be atleast ${ruleValue} INR`
        );
      default:
        // for rest of the fields
        return (
          fieldValue.length < ruleValue &&
          `${fieldName} should be atleast ${ruleValue} in length`
        );
    }
  };

  const isValidFile = (file) => {
    setValues({ ...values, receipt_obj: file });
    const fileErrors = [];
    if (validationSchema.receipt.rules.validateExt(file)) {
      fileErrors.push('Only .jpg, .png or .jpeg files are allowed')
    } else if (validationSchema.receipt.rules.validateSize(file)) {
      fileErrors.push('Receipt should under 5 mb in size')
    }
    setErrors({ ...errors, receipt: fileErrors });
    return fileErrors.length === 0;
  }

  const onSubmit = () => {
    setSubmitted(true);
    const newErrors = validateFormValues();
    if (Object.keys(newErrors).length === 0) {
      const valueToSave = { ...values };
      delete valueToSave['receipt_obj']
      save(valueToSave);
      navigate('/transactions')
    }
  };

  useEffect(() => {
    if (params.id) {
      const transactionData = getById(params.id);
      if (transactionData) {
        setValues(transactionData);
      }
    }
  }, [params])

  useEffect(() => {
    if (submitted) {
      validateFormValues();
    }
    // eslint-disable-next-line
  }, [values]);

  const fieldPropsCommon = { values, errors, setValues };

  return (
    <div className='container'>
      <div className='transction-form-wrapper'>
        <div className='transction-form'>
          <span className='back-link' onClick={() => navigate('/transactions')}>{'< Back To Transactions'}</span>
          <h2>Create Transaction</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <FieldWrapper
              type='date'
              label='Transaction Date'
              name='date'
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='select'
              label='Month Year'
              name='month_year'
              options={monthYearOptions}
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='select'
              label='Transaction Type'
              name='type'
              options={transactionTypeOptions}
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='select'
              label='From Account'
              name='from_account'
              options={accountOptions}
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='select'
              label='To Account'
              name='to_account'
              options={accountOptions}
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='number'
              label='Amount'
              name='amount'
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='file'
              label='Receipt'
              name='receipt'
              isValidFile={isValidFile}
              {...fieldPropsCommon}
            />
            <FieldWrapper
              type='textarea'
              label='Notes'
              name='notes'
              {...fieldPropsCommon}
            />
            <input type='submit' value='Submit' />
          </form>
        </div>
      </div>
    </div>
  );
};
