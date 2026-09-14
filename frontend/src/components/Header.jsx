import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className='ledger-head'>
      <Link className='ledger-brand' to='/llamas'>
        Llama<span>Stay</span>
      </Link>
      <button
        type='button'
        className='ledger-add'
        onClick={() => navigate('/llamaForm')}
      >
        + Add a llama
      </button>
    </header>
  );
};

export default Header;
