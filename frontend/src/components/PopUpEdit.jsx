import { useState } from 'react';
import PropTypes from 'prop-types';
import Slip from './ledger/Slip';
import LlamaForm from './LlamaForm';

const PopUpEdit = ({ llama }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button type='button' className='ledger-add' onClick={() => setOpen(true)}>
        Amend entry
      </button>
      <Slip open={open} onClose={close} label={`Amend ${llama.name}`}>
        <LlamaForm llama={llama} onDone={close} />
      </Slip>
    </>
  );
};

PopUpEdit.propTypes = { llama: PropTypes.object.isRequired };

export default PopUpEdit;
