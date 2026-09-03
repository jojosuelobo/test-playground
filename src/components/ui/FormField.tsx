type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  testId: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
};

export default function FormField({
  label,
  name,
  type = "text",
  testId,
  value,
  onChange,
  required,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-testid={testId}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}
