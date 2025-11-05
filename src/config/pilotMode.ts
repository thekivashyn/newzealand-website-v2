/**
 * 🚀 PILOT MODE CONFIGURATION
 * 
 * This configuration controls whether the app is in pilot mode,
 * where only Mathematics is available as a subject.
 * 
 * When PILOT_MODE_MATH_ONLY is true:
 * - Subject selection screen is skipped
 * - Users go directly from Term selection to Maths topic selection
 * - Breadcrumbs show "Terms" instead of "Subjects"
 * 
 * To enable other subjects:
 * 1. Set PILOT_MODE_MATH_ONLY to false
 * 2. Ensure other subjects have data in constants.ts
 * 3. Test the full flow: Terms → Subjects → Topics → Sub-categories
 */

export const PILOT_MODE_MATH_ONLY = true;

