import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import './style.css'

type inputLabelTypes = {
  label: string;
  id: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputLabeled = ({ label, id, type, onChange }: inputLabelTypes) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        onChange={onChange}
        className="input-overrides !bg-transparent"
      />
    </div>
  );
};

export default InputLabeled;
