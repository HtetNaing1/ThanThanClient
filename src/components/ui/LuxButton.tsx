import Link from 'next/link';

type Variant = 'gold' | 'outline' | 'outlineLight';

const variantClass: Record<Variant, string> = {
  gold: 'btn-gold',
  outline: 'btn-outline',
  outlineLight: 'btn-outline btn-outline-light',
};

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
};

type LuxButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * The storefront button. Gold is precious (primary), outline is quiet,
 * outlineLight sits on the emerald surfaces. Renders a link when given href.
 */
export default function LuxButton(props: LuxButtonProps) {
  const { variant = 'gold', className = '', children } = props;
  const classes = `${variantClass[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={classes}>
      {children}
    </button>
  );
}
