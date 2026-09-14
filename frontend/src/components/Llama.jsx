import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import RecordDetail from './ledger/RecordDetail';
import PopUpEdit from './PopUpEdit';

// Container: resolves the record and its ledger position from the list.
const Llama = props => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { llamaList } = props;
  const index = llamaList.findIndex(l => l.id === id);
  const llama = index >= 0 ? llamaList[index] : null;

  // Redirecting during render is a side effect React may run twice, and the
  // list is empty until the first fetch lands.
  const loaded = llamaList.length > 0;
  useEffect(() => {
    if (loaded && !llama) navigate('/llamas', { replace: true });
  }, [loaded, llama, navigate]);

  if (!llama) return null;

  return (
    <RecordDetail
      llama={llama}
      index={index}
      actions={
        <>
          <PopUpEdit llama={llama} />
          <button
            type='button'
            className='ledger-add is-quiet'
            onClick={() => navigate('/llamas')}
          >
            Back to the ledger
          </button>
        </>
      }
    />
  );
};

const mapStateToProps = state => ({
  llamaList: state.llamaList.list,
});

export default connect(mapStateToProps)(Llama);
