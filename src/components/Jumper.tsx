const Jumper = ({ note }: { note: string }) => {
  return (
    <div className="jumper">
      <div className="jumper-dots">
        <span />
        <span />
        <span />
      </div>
      <div className="jumper-note">{note}</div>
    </div>
  );
};

export default Jumper;
