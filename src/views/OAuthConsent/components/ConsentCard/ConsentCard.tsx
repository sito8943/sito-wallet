// components
import { TextLogo } from "components";

// types
import type { ConsentCardPropsType } from "../../types";

/** Centered card with the app logo that frames every consent state. */
export function ConsentCard(props: ConsentCardPropsType) {
  const { children, className = "" } = props;

  return (
    <section className={`oauth-consent-card base-border ${className}`.trim()}>
      <div className="oauth-consent-logo">
        <TextLogo />
      </div>
      {children}
    </section>
  );
}
