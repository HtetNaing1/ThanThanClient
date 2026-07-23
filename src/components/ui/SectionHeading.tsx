import Reveal from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: 'center' | 'left';
  /** use on emerald surfaces */
  light?: boolean;
  className?: string;
}

/**
 * The recurring page heading: a small-caps eyebrow, the Cormorant title,
 * and — when centred — the signature gem divider. Reveals on scroll.
 */
export default function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <Reveal className={`${align === 'center' ? 'text-center' : ''} ${className}`.trim()}>
      {eyebrow && (
        <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{eyebrow}</span>
      )}
      <h2
        className={`font-display font-light text-[2rem] sm:text-4xl md:text-5xl leading-tight mt-4 ${
          light ? 'text-white' : 'text-forest-900'
        }`}
      >
        {title}
      </h2>
      {align === 'center' && (
        <div className="gem-divider mt-6">
          <span className="gem" />
        </div>
      )}
    </Reveal>
  );
}
