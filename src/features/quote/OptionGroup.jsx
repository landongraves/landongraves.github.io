export function OptionGroup({ legend, name, choices, selectedIndex, onChange }) {
  return (
    <fieldset className="option-group">
      <legend>{legend}</legend>
      <div className="option-row">
        {choices.map((choice, index) => (
          <label className={selectedIndex === index ? "option active" : "option"} key={choice.label}>
            <input
              type="radio"
              name={name}
              value={index}
              checked={selectedIndex === index}
              onChange={() => onChange(index)}
            />
            {choice.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
