import "./AppName.scss";

export default function AppName({ size, ...rest }) {
  const style = {
    fontSize: size,
  };
  return (
    <span className="AppName" {...rest}>
      <span style={size && style} id="noo">
        noo
      </span>
      <span style={size && style} id="tone">
        tone
      </span>
    </span>
  );
}
