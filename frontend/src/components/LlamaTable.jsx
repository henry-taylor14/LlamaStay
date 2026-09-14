import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LedgerTable from './ledger/LedgerTable';
import * as actions from '../actions/llama';
import { notice } from '../lib/notice';

// Container: owns the list data and the dispatches. LedgerTable below it is
// pure and knows nothing about Redux.
const LlamaTable = props => {
  const navigate = useNavigate();

  const onRemove = (id, name) => {
    if (window.confirm(`Remove ${name} from the ledger?`)) {
      props.removeLlama(id, () => notice('Removed.'));
    }
  };

  return (
    <LedgerTable
      llamas={props.llamaList}
      onOpen={id => navigate(`/llamas/${id}`)}
      onShear={id => props.shearLlama(id, () => notice('Sheared.'))}
      onRemove={onRemove}
    />
  );
};

const mapStateToProps = state => ({
  llamaList: state.llamaList.list,
});

const mapActionsToProps = {
  removeLlama: actions.remove,
  shearLlama: actions.shear,
};

export default connect(mapStateToProps, mapActionsToProps)(LlamaTable);
