function getValue(e) {
  console.log(e.target.value);
}

export const inputs = (props) => {
  return (
    <td>
      <input type="text" value={props.v} onChange={getValue} />
    </td>
  );
};

export const checkbox = (props) => {
  return (
    <td>
      <input
        type="checkbox"
        value={props.checkData}
        checked={props.checkData == 1 ? "checked" : ""}
        onChange={getValue}
      />
    </td>
  );
};

export const selects = (props) => {
 
  return (
    <select type="text" value={props.v} onChange={getValue}>
      <option value={props.v}>{props.v}</option>
      {props.selectData.map((data, index) => {
        return (
          <option key={index} value={data.code}>
            {data.product_name}
          </option>
        );
      })}
    </select>
  );
};
