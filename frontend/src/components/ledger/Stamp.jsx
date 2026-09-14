import PropTypes from 'prop-types';

// The inked rubber stamp used to flag a record. Red by default, gold for
// anything that is a note rather than a problem.
const Stamp = ({ children, tone = 'overdue' }) => (
  <span className={tone === 'note' ? 'ledger-stamp is-note' : 'ledger-stamp'}>
    {children}
  </span>
);

Stamp.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['overdue', 'note']),
};

export default Stamp;
