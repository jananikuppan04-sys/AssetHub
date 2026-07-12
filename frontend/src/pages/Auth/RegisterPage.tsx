import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_: FormValues) => {
    toast.info('Registration request submitted. An admin will review your request.');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Request Access</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details and an administrator will approve your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {[
          { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', field: 'name' },
          { id: 'email', label: 'Work Email', type: 'email', placeholder: 'you@company.com', field: 'email' },
          { id: 'department', label: 'Department', type: 'text', placeholder: 'Engineering', field: 'department' },
          { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', field: 'password' },
          { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', field: 'confirmPassword' },
        ].map(({ id, label, type, placeholder, field }) => (
          <div key={id} className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              {...register(field as keyof FormValues)}
              aria-invalid={!!errors[field as keyof FormValues]}
            />
            {errors[field as keyof FormValues] && (
              <p className="text-xs text-destructive" role="alert">
                {errors[field as keyof FormValues]?.message}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Request
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
