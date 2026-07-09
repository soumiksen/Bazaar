import { ChangeEvent, ReactNode } from 'react';
import { INPUT_STYLES, LABEL_STYLES } from '@/app/constants';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  labelAction?: ReactNode;
}

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  labelAction,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      {labelAction ? (
        <div className="flex justify-between items-center px-1">
          <label htmlFor={id} className={LABEL_STYLES}>{label}</label>
          {labelAction}
        </div>
      ) : (
        <label htmlFor={id} className={LABEL_STYLES}>{label}</label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={INPUT_STYLES}
      />
    </div>
  );
}
