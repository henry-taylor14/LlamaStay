import PropTypes from 'prop-types';
import LlamaMark from './LlamaMark';

const ColorSwatch = ({ color }) => (
  <span className='ledger-swatch'>
    <LlamaMark color={color} />
    {color || '—'}
  </span>
);

ColorSwatch.propTypes = { color: PropTypes.string };

export default ColorSwatch;
