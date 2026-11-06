/**
 * Motion's animation features, split into their own chunk by the dynamic
 * import in MotionProvider. `domMax` rather than `domAnimation` because the
 * mobile tab bar's active indicator uses `layoutId` (a layout animation).
 */
import { domMax } from "framer-motion";

export default domMax;
