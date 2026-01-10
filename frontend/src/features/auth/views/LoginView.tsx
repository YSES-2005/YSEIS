import { useLoginViewModel } from '../viewmodels/useLoginViewModel';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import logo from '@/assets/logo.png';
import illustration from '@/assets/dashboard.png';

interface LoginViewProps {
  onSuccess: () => void;
}

export function LoginView({ onSuccess }: LoginViewProps) {
  const { submit, isLoading, error } = useLoginViewModel({ onSuccess });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    submit(Object.fromEntries(formData));
  };

  return (
    <div className="flex h-screen bg-background text-foreground p-4 overflow-hidden">
      {/* Branding Column*/}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary rounded-xl">
        {/* Background orbs*/}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary mix-blend-screen blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent mix-blend-screen blur-[120px] opacity-40" />

        <div className="relative z-10 flex w-full flex-col items-center justify-center pt-32 pb-24 px-20 text-white space-y-12">
          {/* Dashboard preview*/}
          <div className="relative group">
            <div className="relative rounded-[0.8rem] overflow-hidden border border-white/20 shadow-lg transition-transform duration-600 group-hover:scale-[1.03]">
              <img
                src={illustration}
                alt="YSES Dashboard Illustration"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          {/* Hero*/}
          <div className="w-full space-y-4">
            <h1 className="text-center text-4xl font-semibold leading-snug">
              Young Software Engineers' <br /> Inventory System
            </h1>
            <p className="text-center text-white/85 text-base leading-relaxed">
              A centralized management system designed for YSES members to
              effectively track, manage, and organize shared resources.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 lg:p-16 h-screen">
        <div className="w-full max-w-lg space-y-12 -mt-20">
          {/* Lead-in*/}
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="YSES Logo"
                className="h-10 w-auto drop-shadow-md"
              />
              <span className="text-2xl font-semibold tracking-wide select-none">
                YSEIS
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your email address and password to log in
              </p>
            </div>
          </div>

          {/* Login forms */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                className="py-6 px-4 focus-visible:border-primary"
                name="email"
                type="email"
                placeholder="Enter your email address"
              />
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldGroup className="relative">
                <Input
                  className=" py-6 px-4 focus-visible:border-primary w-full"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </FieldGroup>
            </Field>

            {/* Error */}
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            {/* Login button*/}
            <Button
              type="submit"
              className="w-full font-semibold py-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
