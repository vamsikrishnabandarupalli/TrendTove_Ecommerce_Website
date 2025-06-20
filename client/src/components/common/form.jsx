import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) {
  const renderInput = (control) => {
    const value = formData[control.name] || "";

    if (control.componentType === "select") {
      return (
        <Select
          value={value}
          onValueChange={(val) => setFormData({ ...formData, [control.name]: val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={control.label} />
          </SelectTrigger>
          <SelectContent>
            {control.options?.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (control.componentType === "textarea") {
      return (
        <Textarea
          id={control.id}
          name={control.name}
          placeholder={control.placeholder}
          value={value}
          onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
        />
      );
    }
    return (
      <Input
        id={control.name}
        name={control.name}
        type={control.type}
        placeholder={control.placeholder}
        value={value}
        onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
      />
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label className="mb-1">{control.label}</Label>
            {renderInput(control)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full bg-rose-400 hover:bg-rose-500 text-white">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
