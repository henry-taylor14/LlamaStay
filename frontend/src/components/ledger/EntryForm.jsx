import PropTypes from 'prop-types';
import { FIBER_COLORS } from '../../lib/llama';

const Line = ({ id, label, error, required, children }) => (
  <div className={error ? 'has-error' : undefined}>
    <label htmlFor={id}>
      {label}
      {required && <span className='ledger-required'> (required)</span>}
    </label>
    {children}
    {error && <span className='ledger-error'>{error}</span>}
  </div>
);

Line.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
};

// Renders the entry as ruled lines on the page. Holds no state of its own:
// values, errors and every handler arrive as props.
const EntryForm = ({
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isExisting,
  recordNo,
}) => (
  <form className='ledger-form' onSubmit={onSubmit} noValidate>
    <h2 className='ledger-form-title'>
      {isExisting ? 'Amend entry' : 'New entry'}
    </h2>
    <p className='ledger-form-note'>
      {isExisting
        ? `Record No. ${recordNo}`
        : 'The shear date is set when the record is opened.'}
    </p>

    <div className='ledger-entry'>
      <Line id='name' label='Name' error={errors.name} required>
        <input
          id='name'
          name='name'
          type='text'
          value={values.name}
          onChange={onChange}
          maxLength={100}
          autoComplete='off'
        />
      </Line>

      <Line id='color' label='Fiber color' error={errors.color} required>
        <select id='color' name='color' value={values.color} onChange={onChange}>
          <option value=''>Choose a color</option>
          {FIBER_COLORS.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </Line>

      {isExisting && (
        <>
          <Line id='lastShear' label='Last sheared' error={errors.lastShear}>
            <input
              id='lastShear'
              name='lastShear'
              type='date'
              value={values.lastShear}
              onChange={onChange}
            />
          </Line>

          <Line
            id='lastShearAmount'
            label='Yield in millimeters'
            error={errors.lastShearAmount}
          >
            <input
              id='lastShearAmount'
              name='lastShearAmount'
              type='number'
              min={0}
              value={values.lastShearAmount}
              onChange={onChange}
            />
          </Line>
        </>
      )}
    </div>

    <div className='ledger-form-actions'>
      <button type='submit' className='ledger-add'>
        {isExisting ? 'Save changes' : 'Add a llama'}
      </button>
      <button type='button' className='ledger-add is-quiet' onClick={onCancel}>
        Cancel
      </button>
    </div>
  </form>
);

EntryForm.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isExisting: PropTypes.bool,
  recordNo: PropTypes.string,
};

export default EntryForm;
