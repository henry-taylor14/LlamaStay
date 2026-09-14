import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className='ledger-missing'>
    <h1>No such page</h1>
    <p>Nothing is filed under that address.</p>
    <Link className='ledger-add' to='/llamas'>
      Back to the ledger
    </Link>
  </div>
);

export default NotFound;
