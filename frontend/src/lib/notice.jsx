import toast from 'react-hot-toast';

// Every user-facing notice in the app is an inked stamp. Gold for something
// that happened, red for something that did not.
const stamp = (text, tone) => () => (
  <div
    className={tone === 'error' ? 'ledger-notice is-error' : 'ledger-notice'}
    role='status'
  >
    {text}
  </div>
);

export const notice = text => toast.custom(stamp(text));
export const noticeError = text => toast.custom(stamp(text, 'error'));
