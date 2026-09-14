import PropTypes from 'prop-types';
import { colorHex } from '../../lib/llama';

// The ledger's shorthand llama, tinted to the animal's fiber color.
const LlamaMark = ({ color, title }) => (
  <svg
    viewBox='0 0 120 120'
    style={{ color: colorHex(color) }}
    role={title ? 'img' : 'presentation'}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : 'true'}
  >
    <g fill='currentColor'>
      <polygon points='28,60 14,72 24,76 34,64' />
      <ellipse cx='55' cy='70' rx='30' ry='18' />
      <rect x='30' y='82' width='8' height='26' rx='3' />
      <rect x='46' y='86' width='8' height='26' rx='3' />
      <rect x='66' y='86' width='8' height='26' rx='3' />
      <rect x='80' y='82' width='8' height='26' rx='3' />
      <polygon points='78,58 100,20 110,24 90,64' />
      <circle cx='103' cy='20' r='12' />
      <polygon points='96,10 99,2 103,11' />
      <polygon points='106,9 110,1 113,10' />
    </g>
  </svg>
);

LlamaMark.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
};

export default LlamaMark;
