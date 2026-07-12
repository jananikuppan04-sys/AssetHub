import React from 'react';
import { useFormContext, Controller, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/types';

// ================================================================
// Base wrapper used by all form fields
// ================================================================
interface FieldWrapperProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function FieldWrapper({ name, label, error, required, className, children }: FieldWrapperProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}
    </div>
  );
}

// ================================================================
// FormInput
// ================================================================
interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  required,
  disabled,
  className,
}: FormInputProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldWrapper name={name} label={label} error={error} required={required} className={className}>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        {...register(name)}
      />
    </FieldWrapper>
  );
}

// ================================================================
// FormTextarea
// ================================================================
interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 3,
  required,
  disabled,
  className,
}: FormTextareaProps<T>) {
  const { register, formState: { errors } } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldWrapper name={name} label={label} error={error} required={required} className={className}>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        aria-invalid={!!error}
        {...register(name)}
      />
    </FieldWrapper>
  );
}

// ================================================================
// FormSelect
// ================================================================
interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  placeholder = 'Select...',
  options,
  required,
  disabled,
  className,
}: FormSelectProps<T>) {
  const { control, formState: { errors } } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <FieldWrapper name={name} label={label} error={error} required={required} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={name} aria-invalid={!!error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldWrapper>
  );
}

// ================================================================
// FormCheckbox
// ================================================================
interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  description,
  disabled,
  className,
}: FormCheckboxProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        )}
      />
      <div className="space-y-0.5">
        <Label htmlFor={name} className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
