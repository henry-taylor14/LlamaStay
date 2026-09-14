import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// An entry slip laid over the book. Uses <dialog> so focus trapping, Escape
// and the backdrop come from the platform rather than from us.
const Slip = ({ open, onClose, label, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className='ledger-slip' aria-label={label} onClose={onClose}>
      {open && children}
    </dialog>
  );
};

Slip.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
};

export default Slip;
