import type { ReactNode } from "react";

const Stage = ({
  id,
  ariaLabel,
  label,
  title,
  children,
}: {
  id?: string;
  ariaLabel: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
}) => {
  return (
    <section className="stage" id={id} aria-label={ariaLabel}>
      <div className="stage-inner">
        <div className="stage-label">{label}</div>
        <div className="stage-title">{title}</div>
        {children}
      </div>
    </section>
  );
};

export default Stage;
