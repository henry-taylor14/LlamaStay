import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useForm from './useForm';
import EntryForm from './ledger/EntryForm';
import * as actions from '../actions/llama';
import { entryNo } from '../lib/llama';
import { toDateInputValue } from '../lib/dates';
import { notice } from '../lib/notice';

const blankEntry = { name: '', color: '' };

// Container: owns validation, the submit payload and the dispatches.
// EntryForm renders; it holds nothing.
const LlamaForm = props => {
  const navigate = useNavigate();
  const existing = props.llama;
  const done = props.onDone || (() => navigate('/llamas'));

  const validateForm = (fieldValues = values) => {
    const temp = { ...errors };

    if ('name' in fieldValues) {
      const name = fieldValues.name.trim();
      temp.name = name ? '' : 'Give the llama a name.';
      if (name && name.length < 2) temp.name = 'Use at least two characters.';
    }

    if ('color' in fieldValues) {
      temp.color = fieldValues.color ? '' : 'Choose a fiber color.';
    }

    if (existing) {
      if ('lastShear' in fieldValues) {
        temp.lastShear = fieldValues.lastShear ? '' : 'Give a shear date.';
      }
      if ('lastShearAmount' in fieldValues) {
        const amount = parseFloat(fieldValues.lastShearAmount);
        temp.lastShearAmount =
          isNaN(amount) || amount < 0 ? 'Yield cannot be negative.' : '';
      }
    }

    setErrors({ ...temp });

    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };

  const { values, errors, setErrors, handleInputChange } = useForm(
    existing
      ? {
          name: existing.name || '',
          color: existing.color || '',
          lastShear: toDateInputValue(existing.lastShear),
          lastShearAmount: existing.lastShearAmount || 0,
        }
      : blankEntry,
    validateForm
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    if (existing) {
      // Only the fields this form owns — never the record's own metadata.
      props.updateLlama(
        {
          id: existing.id,
          name: values.name.trim(),
          color: values.color,
          lastShear: new Date(values.lastShear).toISOString(),
          lastShearAmount: parseInt(values.lastShearAmount, 10) || 0,
        },
        () => {
          notice('Saved.');
          done();
        }
      );
    } else {
      // The backend stamps the shear date when the record is opened.
      props.createLlama({ name: values.name.trim(), color: values.color }, () => {
        notice('Added.');
        done();
      });
    }
  };

  const index = existing
    ? props.llamaList.findIndex(l => l.id === existing.id)
    : -1;

  return (
    <EntryForm
      values={values}
      errors={errors}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={done}
      isExisting={Boolean(existing)}
      recordNo={index >= 0 ? entryNo(index) : undefined}
    />
  );
};

const mapStateToProps = state => ({
  llamaList: state.llamaList.list,
});

const mapActionsToProps = {
  createLlama: actions.create,
  updateLlama: actions.update,
};

export default connect(mapStateToProps, mapActionsToProps)(LlamaForm);
