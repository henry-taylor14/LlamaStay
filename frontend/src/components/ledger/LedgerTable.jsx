import PropTypes from 'prop-types';
import LedgerRow from './LedgerRow';

const LedgerTable = ({ llamas, onOpen, onShear, onRemove }) => {
  if (llamas.length === 0) {
    return (
      <div className='ledger-empty'>
        <p>No entries yet.</p>
        <span>Record your first llama to open the book.</span>
      </div>
    );
  }

  return (
    <div className='ledger-table-wrap'>
      <table className='ledger-table'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Color</th>
            <th>Last sheared</th>
            <th className='num'>Yield</th>
            <th>
              <span className='visually-hidden'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {llamas.map((llama, index) => (
            <LedgerRow
              key={llama.id}
              llama={llama}
              index={index}
              onOpen={onOpen}
              onShear={onShear}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

LedgerTable.propTypes = {
  llamas: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  onShear: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default LedgerTable;
