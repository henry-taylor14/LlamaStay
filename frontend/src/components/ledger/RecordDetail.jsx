import PropTypes from 'prop-types';
import LlamaImg from '../LlamaImg';
import Stamp from './Stamp';
import { entryNo, formatYield, isOverdue } from '../../lib/llama';
import { formatDate } from '../../lib/dates';

const Field = ({ label, children }) => (
  <div className='ledger-field'>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

Field.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };

const RecordDetail = ({ llama, index, actions }) => {
  const overdue = isOverdue(llama.lastShear);

  return (
    <div className='ledger-detail'>
      <LlamaImg color={llama.color} />
      <div>
        <p className='ledger-detail-no'>
          Record No. {entryNo(index)}
          {overdue && <Stamp>overdue</Stamp>}
        </p>
        <h1 className='ledger-detail-name'>{llama.name}</h1>
        <dl className='ledger-fields'>
          <Field label='Color'>{llama.color || '—'}</Field>
          <Field label='Last sheared'>{formatDate(llama.lastShear)}</Field>
          <Field label='Yield'>{formatYield(llama.lastShearAmount)}</Field>
          <Field label='Status'>{overdue ? 'Due a shear' : 'On schedule'}</Field>
        </dl>
        {actions && <div className='ledger-detail-foot'>{actions}</div>}
      </div>
    </div>
  );
};

RecordDetail.propTypes = {
  llama: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  actions: PropTypes.node,
};

export default RecordDetail;
