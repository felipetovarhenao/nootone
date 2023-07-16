import "./EditableField.scss";
import { useState } from "react";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import cn from "classnames";

type EditableFieldProps = {
  onConfirm?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  maxLength?: number;
};

const EditableField = ({ className, defaultValue, onConfirm }: EditableFieldProps) => {
  const [onEdit, setOnEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(defaultValue || "");
  const [oldValue, setOldValue] = useState(defaultValue || "");

  function handleConfirm() {
    setOnEdit(false);
    if (onConfirm) {
      onConfirm(currentValue);
    }
    setOldValue(currentValue);
  }
  function handleCancel() {
    setCurrentValue(oldValue);
    setOnEdit(false);
  }

  function handleEdit() {
    setOldValue(currentValue);
    setOnEdit(true);
  }

  return (
    <div className={cn(className, "EditableField")}>
      {onEdit ? (
        <input
          maxLength={36}
          className="EditableField__value"
          defaultValue={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          type="text"
          autoFocus
        />
      ) : (
        <span className="EditableField__value">{currentValue}</span>
      )}
      <div className="EditableField__options">
        {onEdit ? (
          <>
            <div className="EditableField__options__option --success">
              <Icon className="EditableField__options__option__icon" icon={icons.check} onClick={handleConfirm} />
            </div>
            <div className="EditableField__options__option --danger">
              <Icon className="EditableField__options__option__icon" icon={icons.close} onClick={handleCancel} />
            </div>
          </>
        ) : (
          <div className="EditableField__options__option --primary">
            <Icon className="EditableField__options__option__icon" icon={icons.edit} onClick={handleEdit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableField;
