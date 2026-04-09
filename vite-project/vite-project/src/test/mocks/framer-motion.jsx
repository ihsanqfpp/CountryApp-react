/**
 * Shared Framer Motion mock for all test files.
 *
 * The real framer-motion passes animation props (whileHover, whileTap, etc.)
 * down to DOM elements in a jsdom environment, which triggers React warnings.
 * This mock strips those props before rendering so tests stay noise-free.
 */

const MOTION_PROPS = [
  'initial', 'animate', 'exit', 'transition',
  'variants', 'whileHover', 'whileTap', 'whileFocus',
  'whileInView', 'viewport', 'layout', 'layoutId',
];

const stripMotionProps = (props) => {
  const clean = { ...props };
  MOTION_PROPS.forEach((key) => delete clean[key]);
  return clean;
};

const createMotionComponent = (tag) =>
  ({ children, ...props }) => {
    const Tag = tag;
    return <Tag {...stripMotionProps(props)}>{children}</Tag>;
  };

export const motion = new Proxy({}, {
  get: (_, tag) => createMotionComponent(tag),
});

export const AnimatePresence = ({ children }) => <>{children}</>;
export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useMotionValue = (initial) => ({ get: () => initial, set: () => {} });
export const useTransform = () => ({ get: () => 0 });
