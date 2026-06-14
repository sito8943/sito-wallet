// Active card width as a fraction of the viewport, leaving room for the
// neighbouring cards to peek on each side.
export const SLIDE_PEEK_RATIO = 0.84;

// Horizontal gap between slides (px). Mirrored in JS step math and inline style.
export const SLIDE_GAP = 12;

// A release counts as a swipe when it travels past this fraction of a slide…
export const SWIPE_DISTANCE_THRESHOLD = 0.2;

// …or flicks faster than this velocity (px/ms), regardless of distance.
export const SWIPE_VELOCITY_THRESHOLD = 0.4;

// Movement (px) below which a pointer gesture is treated as a tap, not a drag.
export const TAP_SLOP = 8;

// Viewport offset (px) at which the sticky dots bar takes over on scroll.
export const STICKY_TOP_PX = 56;
