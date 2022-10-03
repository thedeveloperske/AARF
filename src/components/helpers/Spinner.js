export const Spinner = () => {
  return (
    <div
      className="spinner-border text-info mx-auto"
      id="spinner"
      role="status"
      style={{ display: "none", marginTop: "50px", overlay:"zIndex: 1000" }}
    ></div>
  );
};
