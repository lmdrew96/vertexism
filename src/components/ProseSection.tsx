import type { ReactNode } from "react";

const ProseSection = ({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) => {
  return (
    <div className="reading" id={id}>
      {children}
    </div>
  );
};

export default ProseSection;
