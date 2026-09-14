import PropTypes from 'prop-types';
import ColorSwatch from './ColorSwatch';
import Stamp from './Stamp';
import { entryNo, formatYield, isOverdue } from '../../lib/llama';
import { formatDate } from '../../lib/dates';

const LedgerRow = ({ llama, index, onOpen, onShear, onRemove }) => (
  <tr>
    <td className='entry'>{entryNo(index)}</td>
    <td className='name'>
      <button
        type='button'
        className='ledger-name-link'
        onClick={() => onOpen(llama.id)}
      >
        {llama.name}
      </button>
    </td>
    <td>
      <ColorSwatch color={llama.color} />
    </td>
    <td>
      {formatDate(llama.lastShear)}
      {isOverdue(llama.lastShear) && <Stamp>overdue</Stamp>}
    </td>
    <td className='num'>{formatYield(llama.lastShearAmount)}</td>
    <td>
      <div className='ledger-actions'>
        <button type='button' onClick={() => onShear(llama.id)}>
          shear
        </button>
        <button type='button' onClick={() => onRemove(llama.id, llama.name)}>
          remove
        </button>
      </div>
    </td>
  </tr>
);

LedgerRow.propTypes = {
  llama: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onOpen: PropTypes.func.isRequired,
  onShear: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default LedgerRow;
