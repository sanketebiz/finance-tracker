export const FormField = (props) => {
  const { name, errors = {} } = props;

  let errorBlock = <></>;

  if (errors[name]) {
    errorBlock = (
      <div className='field-errors'>
        {[errors[name][0]].map((error, i) => (
          <div key={i}><span >{error}</span></div>
        ))}
      </div>
    );
  }

  return (
    <div className='form-field'>
      <Field {...props} />
      {errorBlock}
    </div>
  );
};

const Field = ({
  name,
  type,
  options,
  placeholder,
  label,
  values,
  onChange,
  isValidFile
}) => {
  let fieldBlock = <></>;

  const onFieldChange = (e) => {
    onChange(e.target.value);
  };

  const onSelectFile = (files) => {
    if (files[0]) {
      if (isValidFile && !isValidFile(files[0])) {
        onChange('');
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = function (e) {
        onChange(e.target.result);
      }
    }
  }

  switch (type) {
    case 'select':
      fieldBlock = (
        <select
          name={name}
          id={name}
          value={values[name]}
          onChange={onFieldChange}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'number':
      fieldBlock = (
        <input
          type='number'
          id={name}
          name={name}
          placeholder={placeholder}
          value={values[name]}
          onChange={onFieldChange}
        />
      );
      break;
    case 'date':
      fieldBlock = (
        <input
          type='date'
          id={name}
          name={name}
          placeholder={placeholder}
          value={values[name]}
          onChange={onFieldChange}
        />
      );
      break;
    case 'textarea':
      fieldBlock = (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={values[name]}
          onChange={onFieldChange}
        />
      );
      break;
    case 'file':
      fieldBlock = (
        <>
          <input
            type='file'
            id={name}
            name={name}
            placeholder={placeholder}
            onChange={e => {
              onSelectFile(e.target.files);
            }}
            style={{ display: 'none' }}
          />

          <label for={name}>
            <div className='button'>
              Select File
            </div>
          </label>

          {values[name] && <div className='media-preview'>
            <img src={values[name]} alt="media-preview" />
          </div>}
        </>
      );
      break;
    default:
      fieldBlock = (
        <input
          type='text'
          id={name}
          name={name}
          placeholder={placeholder}
          value={values[name]}
          onChange={onFieldChange}
        />
      );
      break;
  }
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div>{fieldBlock}</div>
    </>
  );
};
