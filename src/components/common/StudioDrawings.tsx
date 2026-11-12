import React from 'react';

interface DrawingProps {
  className?: string;
  size?: number | string;
}

/**
 * Classical Pilates Reformer Line Art Drawing
 * Elegant, minimalist studio drawing of the reformer carriage, springs, footbar, and straps.
 */
export const PilatesReformerDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft ambient aura background */}
    <ellipse cx="160" cy="95" rx="130" ry="55" fill="currentColor" fillOpacity="0.05" />
    <path
      d="M35 140C70 148 250 148 285 140"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      strokeOpacity="0.3"
    />

    {/* Reformer Wooden Frame / Rails */}
    <path
      d="M25 110 L295 110 C298 110 300 112 300 115 L298 126 C298 128 296 130 293 130 L27 130 C24 130 22 128 22 126 L20 115 C20 112 22 110 25 110 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.08"
    />
    {/* Legs / Stand Base */}
    <path
      d="M45 130 L40 152 M275 130 L280 152"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M32 152 L52 152 M268 152 L288 152"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Moving Carriage */}
    <rect
      x="80"
      y="96"
      width="135"
      height="14"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Carriage Padded Cushion Top */}
    <path
      d="M84 96 C84 91 90 89 95 89 L210 89 C214 89 217 92 217 96"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.1"
    />

    {/* Shoulder Rests & Headrest */}
    <path
      d="M96 89 L96 74 C96 71 99 69 102 69 C105 69 108 71 108 74 L108 89"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      fillOpacity="0.25"
    />
    <path
      d="M120 89 L120 74 C120 71 123 69 126 69 C129 69 132 71 132 74 L132 89"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="currentColor"
      fillOpacity="0.25"
    />
    {/* Adjustable Headrest */}
    <path
      d="M72 87 C72 82 76 79 81 79 L88 79 L88 95 L72 95 Z"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.15"
    />

    {/* Springs under carriage */}
    <path
      d="M215 103 L235 103 C238 99 240 107 243 103 C246 99 248 107 251 103 C254 99 256 107 259 103 L275 103"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M215 107 L237 107 C240 104 242 110 245 107 C248 104 250 110 253 107 L275 107"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.7"
    />

    {/* Footbar Structure (Right side) */}
    <path
      d="M265 110 L272 58 C273 53 277 50 282 50 L286 50 C291 50 295 53 296 58 L290 110"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Padded Footbar Cover */}
    <rect
      x="270"
      y="47"
      width="24"
      height="7"
      rx="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.3"
    />

    {/* Pulley Risers and Ropes (Left side) */}
    <path
      d="M38 110 L38 62"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="38" cy="60" r="4.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
    {/* Fluid Tension Rope & Loop */}
    <path
      d="M42 61 C60 66 85 76 102 78"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
    <path
      d="M48 68 C44 75 48 83 55 83 C60 83 62 76 56 71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Subtle Mindful Sunlight / Floral Flourish */}
    <circle cx="280" cy="30" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="292" cy="24" r="2" fill="currentColor" fillOpacity="0.5" />
    <circle cx="270" cy="22" r="1" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

/**
 * Elegant Mindful Pilates Alignment Silhouette Drawing
 * A minimalist fine line drawing of a person in fluid, graceful extension on a reformer / mat.
 */
export const PilatesPoseDrawing: React.FC<
  DrawingProps & { pose?: 'swan' | 'teaser' | 'stretch' | 'reformer-flow' }
> = ({ className = 'w-full h-auto text-emerald-800 dark:text-emerald-300', size, pose = 'reformer-flow' }) => {
  if (pose === 'teaser') {
    return (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <ellipse cx="100" cy="142" rx="60" ry="10" fill="currentColor" fillOpacity="0.06" />
        {/* Head */}
        <circle cx="70" cy="54" r="8" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
        {/* Neck & Torso in 'V' teaser shape */}
        <path
          d="M74 62 C78 72 84 92 98 122 C99 125 102 126 104 124 C116 112 142 84 165 52"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Legs Extended upward */}
        <path
          d="M102 123 C118 108 144 80 168 50 C170 47 174 46 177 49 C177 52 174 56 170 60 L108 126"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="currentColor"
          fillOpacity="0.1"
        />
        {/* Arms reached parallel to legs */}
        <path
          d="M86 86 C105 82 132 72 155 58"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Delicate energy arc */}
        <path
          d="M48 110 C50 60 110 30 160 38"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.35"
        />
      </svg>
    );
  }

  if (pose === 'swan') {
    return (
      <svg
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <ellipse cx="100" cy="120" rx="70" ry="10" fill="currentColor" fillOpacity="0.06" />
        {/* Swan Arching Silhouette */}
        <circle cx="145" cy="38" r="8" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
        {/* Spine Extension Curve */}
        <path
          d="M141 46 C136 56 122 75 100 88 C78 100 48 108 25 110"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Supporting Arms Grounded */}
        <path
          d="M122 75 L128 112 M134 76 L139 112"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Mat Base */}
        <path
          d="M18 112 L175 112"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      </svg>
    );
  }

  // Default: Graceful Reformer Flow Extension
  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Ambient background wash */}
      <ellipse cx="120" cy="115" rx="90" ry="15" fill="currentColor" fillOpacity="0.05" />

      {/* Carriage Outline */}
      <rect
        x="35"
        y="105"
        width="160"
        height="8"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <line x1="20" y1="113" x2="215" y2="113" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Head & Neck */}
      <circle cx="58" cy="80" r="7.5" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.2" />
      {/* Torso & Core Flow */}
      <path
        d="M65 86 C80 92 105 96 130 96 C148 96 172 82 195 55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Extended Leg */}
      <path
        d="M130 96 C152 90 178 72 202 46 C205 43 209 45 208 49 C202 58 180 84 150 98"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Arm with Reformer Strap */}
      <path
        d="M80 92 C95 75 115 62 135 55"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Strap tension line */}
      <path
        d="M25 70 C50 64 95 58 135 55"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="3 3"
        strokeOpacity="0.45"
      />
      {/* Footbar touch */}
      <path
        d="M185 113 L192 78 L210 78"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
    </svg>
  );
};

/**
 * Handcrafted Ceramic Tea Cup & Steam Drawing
 * Fits the studio 2 sweetened teas / herbal infusion routine.
 */
export const MindfulTeaDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-amber-800 dark:text-amber-300',
  size
}) => (
  <svg
    viewBox="0 0 160 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft aura */}
    <ellipse cx="80" cy="115" rx="55" ry="12" fill="currentColor" fillOpacity="0.06" />

    {/* Saucer */}
    <ellipse
      cx="80"
      cy="112"
      rx="50"
      ry="9"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <path
      d="M45 112 C55 116 105 116 115 112"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.4"
    />

    {/* Ceramic Cup Body */}
    <path
      d="M48 68 C50 96 62 108 80 108 C98 108 110 96 112 68 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.14"
    />
    {/* Cup Rim */}
    <ellipse
      cx="80"
      cy="68"
      rx="32"
      ry="6"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.25"
    />

    {/* Cup Handle */}
    <path
      d="M108 74 C122 74 125 94 104 98"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Gentle Rising Steam Wisps */}
    <path
      d="M72 56 C68 46 76 38 72 28 C70 23 66 20 68 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />
    <path
      d="M84 54 C88 44 80 36 85 25 C88 19 92 16 90 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 3"
    />

    {/* Botanical Tea Leaf Accents beside saucer */}
    <path
      d="M125 110 C134 104 140 108 142 114 C136 115 128 114 125 110 Z"
      stroke="currentColor"
      strokeWidth="1.25"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M125 110 L137 111"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Wholesome Nourishment Bowl Drawing
 * Minimalist line drawing of an earthen grain & greens bowl with spoon.
 */
export const WholesomeBowlDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 160 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="80" cy="110" rx="55" ry="10" fill="currentColor" fillOpacity="0.05" />

    {/* Bowl Silhouette */}
    <path
      d="M30 62 C34 94 52 108 80 108 C108 108 126 94 130 62 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Bowl Foot / Base */}
    <path
      d="M65 108 L62 114 L98 114 L95 108"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.2"
    />
    {/* Top Rim */}
    <ellipse
      cx="80"
      cy="62"
      rx="50"
      ry="10"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.2"
    />

    {/* Wholesome ingredients (Avocado slice, greens, grains) */}
    {/* Leaf / Herb */}
    <path
      d="M60 58 C52 45 64 35 72 44 C76 49 72 58 60 58 Z"
      stroke="currentColor"
      strokeWidth="1.25"
      fill="currentColor"
      fillOpacity="0.25"
    />
    <path d="M62 52 L68 42" stroke="currentColor" strokeWidth="1" />

    {/* Sliced Avocado / Healthy Fat crescent */}
    <path
      d="M75 58 C80 44 95 44 100 56 C95 62 82 62 75 58 Z"
      stroke="currentColor"
      strokeWidth="1.25"
      fill="currentColor"
      fillOpacity="0.18"
    />

    {/* Sesame / Seed dots */}
    <circle cx="56" cy="62" r="1.25" fill="currentColor" />
    <circle cx="92" cy="60" r="1.25" fill="currentColor" />
    <circle cx="106" cy="58" r="1.25" fill="currentColor" />

    {/* Wooden Spoon Resting in Bowl */}
    <path
      d="M102 58 L128 30 C130 28 134 28 136 30 C138 32 138 36 136 38 L114 62"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.3"
    />
  </svg>
);

/**
 * Ribbed Glass Water Carafe & Goblet Drawing
 * Visual art for the 2.0–2.5 L daily hydration tracker.
 */
export const WaterCarafeDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-sky-700 dark:text-sky-300',
  size
}) => (
  <svg
    viewBox="0 0 160 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft water puddle / aura */}
    <ellipse cx="80" cy="120" rx="60" ry="10" fill="currentColor" fillOpacity="0.05" />

    {/* Carafe Body */}
    <path
      d="M62 38 L62 50 C50 68 45 92 50 114 C52 118 56 120 62 120 L98 120 C104 120 108 118 110 114 C115 92 110 68 98 50 L98 38 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    {/* Carafe Neck Flute */}
    <ellipse
      cx="80"
      cy="38"
      rx="18"
      ry="5"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.2"
    />

    {/* Water Level Line inside Carafe */}
    <path
      d="M52 82 C65 80 95 86 108 82"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Floating Citrus slice in water */}
    <circle cx="80" cy="94" r="8" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 2" fill="none" />
    <path d="M80 86 L80 102 M72 94 L88 94" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

    {/* Glass Tumbler Beside Carafe */}
    <path
      d="M116 75 L120 116 C120 118 122 120 126 120 L136 120 C140 120 142 118 142 116 L146 75 Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <ellipse cx="131" cy="75" rx="15" ry="3.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Glass Water Level */}
    <line x1="122" y1="92" x2="140" y2="92" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />

    {/* Pure Water Droplets in air */}
    <path
      d="M74 24 C74 21 78 16 78 16 C78 16 82 21 82 24 C82 26 80 28 78 28 C76 28 74 26 74 24 Z"
      stroke="currentColor"
      strokeWidth="1.25"
      fill="currentColor"
      fillOpacity="0.25"
    />
  </svg>
);

/**
 * Botanical Olive & Eucalyptus Branch Drawing
 * Subtle, luxury wellness sketch for cooking oil, studio rules, and aesthetic accents.
 */
export const BotanicalBranchDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Main organic stem */}
    <path
      d="M20 105 C45 95 80 75 138 22"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      fill="none"
    />

    {/* Paired Leaves */}
    {/* Leaf 1 */}
    <path
      d="M50 90 C42 82 46 70 58 72 C64 80 60 88 50 90 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Leaf 2 */}
    <path
      d="M56 86 C68 84 76 92 72 102 C60 102 54 94 56 86 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.18"
    />
    {/* Leaf 3 */}
    <path
      d="M82 66 C72 56 78 44 90 48 C96 56 90 64 82 66 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.22"
    />
    {/* Leaf 4 */}
    <path
      d="M92 60 C104 56 112 66 108 76 C96 74 90 66 92 60 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.22"
    />
    {/* Tip Leaf */}
    <path
      d="M125 32 C126 22 138 18 142 22 C142 32 134 38 125 32 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.28"
    />

    {/* Small Olive Berries */}
    <ellipse cx="68" cy="80" rx="3.5" ry="4.5" fill="currentColor" fillOpacity="0.35" />
    <ellipse cx="102" cy="52" rx="3.5" ry="4.5" fill="currentColor" fillOpacity="0.35" />
  </svg>
);

/**
 * Gentle Winding Walking Path Drawing
 * Visual art for the 8,000–10,000 daily steps guideline.
 */
export const GentleWalkingPathDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Distant Hills Line */}
    <path
      d="M10 70 C40 50 70 65 110 52 C135 44 148 48 155 52"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeDasharray="2 2"
      strokeOpacity="0.4"
    />
    {/* Gentle Sunrise / Sun disc behind hills */}
    <circle cx="120" cy="40" r="14" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />

    {/* Winding Trail Path */}
    <path
      d="M30 115 C55 105 75 92 70 82 C65 72 82 66 96 55"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 118 C70 108 90 96 86 84 C82 74 96 68 108 55"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.6"
      fill="none"
    />

    {/* Stepping Stones along the path */}
    <ellipse cx="44" cy="108" rx="4" ry="2.5" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="65" cy="95" rx="3.5" ry="2" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="76" cy="82" rx="3" ry="1.75" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="90" cy="70" rx="2.5" ry="1.5" fill="currentColor" fillOpacity="0.25" />

    {/* Wild grasses on path side */}
    <path d="M22 110 C20 100 24 94 22 88 M26 112 C28 102 32 98 34 94" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M135 72 C138 65 142 62 144 58" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

/**
 * Peaceful Crescent Moon & Evening Air Drawing
 * Visual art for 7+ hours rest and sleep recovery.
 */
export const PeacefulMoonDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-indigo-800 dark:text-indigo-300',
  size
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft twilight aura */}
    <circle cx="80" cy="58" r="45" fill="currentColor" fillOpacity="0.05" />

    {/* Slender Crescent Moon */}
    <path
      d="M88 28 C64 34 52 56 62 82 C72 104 96 106 108 94 C88 94 72 78 78 54 C82 38 90 32 88 28 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.18"
    />

    {/* Delicate Evening Stars */}
    <g fill="currentColor">
      {/* 4-point star 1 */}
      <path d="M118 36 L120 42 L126 44 L120 46 L118 52 L116 46 L110 44 L116 42 Z" fillOpacity="0.4" />
      {/* 4-point star 2 */}
      <path d="M48 48 L49 52 L53 53 L49 54 L48 58 L47 54 L43 53 L47 52 Z" fillOpacity="0.3" />
      {/* Tiny constellation dots */}
      <circle cx="106" cy="74" r="1.5" fillOpacity="0.35" />
      <circle cx="132" cy="62" r="1.25" fillOpacity="0.3" />
      <circle cx="38" cy="70" r="1.25" fillOpacity="0.25" />
    </g>

    {/* Gentle cloud drift line */}
    <path
      d="M45 88 C60 82 85 86 115 80"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeDasharray="4 4"
      strokeOpacity="0.35"
    />
  </svg>
);

/**
 * Minimalist Rising Sun & Morning Serenity Line Art
 */
export const MorningSunDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-amber-700 dark:text-amber-300',
  size
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft morning ambient aura */}
    <circle cx="80" cy="70" r="45" fill="currentColor" fillOpacity="0.06" />

    {/* Horizon line */}
    <path
      d="M20 85 L140 85"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />

    {/* Rising Sun Half Disc */}
    <path
      d="M50 85 C50 68 63 55 80 55 C97 55 110 68 110 85 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.18"
    />

    {/* Sunrays */}
    <line x1="80" y1="42" x2="80" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="56" y1="51" x2="50" y2="45" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="104" y1="51" x2="110" y2="45" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="39" y1="72" x2="31" y2="70" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="121" y1="72" x2="129" y2="70" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />

    {/* Gentle morning ripples */}
    <path
      d="M45 96 C60 94 75 97 95 94 C105 92 115 95 125 93"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeDasharray="3 3"
      strokeOpacity="0.35"
    />
  </svg>
);

/**
 * Botanical Whole Fruit Harvest Drawing
 * Visual art for the 1–2 portions whole fruit recommendation.
 */
export const WholeFruitHarvestDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-rose-800 dark:text-rose-300',
  size
}) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Soft aura */}
    <ellipse cx="80" cy="100" rx="50" ry="10" fill="currentColor" fillOpacity="0.05" />

    {/* Fresh Apple / Pomegranate */}
    <path
      d="M58 48 C44 48 38 62 40 78 C42 94 54 102 68 102 C82 102 88 96 90 92 C92 96 98 102 112 102 C126 102 136 92 138 78 C140 60 132 48 118 48 C106 48 98 54 90 56 C82 54 72 48 58 48 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.14"
    />
    {/* Indent & Stem */}
    <path
      d="M90 56 C90 44 94 36 96 28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Fresh Leaf on Stem */}
    <path
      d="M96 36 C105 32 112 36 114 42 C108 44 100 42 96 36 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.25"
    />

    {/* Citrus Slice / Berry beside */}
    <ellipse cx="50" cy="85" rx="10" ry="8" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" fill="none" />
  </svg>
);

/**
 * Instructor Alignment & Guidance Line Art Drawing
 * Elegant mindful instruction illustration of teacher guiding client posture.
 */
export const InstructorAlignmentDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 240 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Ambient studio ground aura */}
    <ellipse cx="120" cy="125" rx="95" ry="14" fill="currentColor" fillOpacity="0.05" />

    {/* Mat Line */}
    <path
      d="M20 125 L220 125"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />

    {/* Client in gentle spine stretch / bridge */}
    <circle cx="65" cy="115" r="7" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
    <path
      d="M72 118 C85 110 102 96 122 96 C140 96 155 110 162 125"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Client Grounded Feet */}
    <path d="M162 125 L172 125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Instructor kneeling beside client with guiding hands */}
    {/* Instructor Head */}
    <circle cx="118" cy="46" r="7.5" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.2" />
    {/* Instructor Torso */}
    <path
      d="M120 54 C122 68 126 84 134 98 C136 104 140 115 146 125"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Instructor Folded Leg / Kneel */}
    <path
      d="M134 98 L122 112 L138 125"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Instructor Guiding Arm reaching to client's core / spine alignment */}
    <path
      d="M122 66 C115 74 108 84 112 94"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Gentle alignment aura ring */}
    <circle cx="112" cy="95" r="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
  </svg>
);

/**
 * Cadillac Trapeze / Tower Studio Apparatus Drawing
 */
export const CadillacTrapezeDrawing: React.FC<DrawingProps> = ({
  className = 'w-full h-auto text-emerald-800 dark:text-emerald-300',
  size
}) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <ellipse cx="100" cy="130" rx="80" ry="12" fill="currentColor" fillOpacity="0.05" />
    {/* Table Base */}
    <rect x="25" y="105" width="150" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <path d="M35 117 L32 135 M165 117 L168 135" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Tower Canopy Vertical Poles */}
    <path d="M35 105 L35 25 M165 105 L165 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Top Crossbar */}
    <path d="M30 25 L170 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Trapeze Bar & Hanging Springs */}
    <path d="M75 25 L75 55 M125 25 L125 55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
    <rect x="68" y="55" width="64" height="4" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" />
    {/* Hanging strap loop */}
    <path d="M80 59 C80 68 86 74 92 74 C98 74 100 68 100 59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

