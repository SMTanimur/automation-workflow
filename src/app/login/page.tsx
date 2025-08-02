'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Form schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginLoading, loginError, register, registerLoading, registerError } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      agreeToTerms: false,
    },
  });

  const handleLogin = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleRegister = (data: RegisterFormData) => {
    const { confirmPassword, agreeToTerms, ...registerData } = data;
    register(registerData, {
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Brand */}
        <div className='text-center mb-8'>
          <div className='mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4'>
            <Mail className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Email Builder</h1>
          <p className='text-gray-600 mt-2'>Create stunning email templates</p>
        </div>

        <Card className='shadow-xl'>
          <Tabs defaultValue='login' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='login'>Sign In</TabsTrigger>
              <TabsTrigger value='register'>Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value='login'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>
                  Welcome Back
                </CardTitle>
                <p className='text-gray-600 text-center'>
                  Sign in to your Email Builder account
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email Address</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='Enter your email'
                        className='pl-10'
                        {...loginForm.register('email')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className='text-sm text-red-500 mt-1'>
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        className='pl-10 pr-10'
                        {...loginForm.register('password')}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='w-4 h-4' />
                        ) : (
                          <Eye className='w-4 h-4' />
                        )}
                      </button>
                      {loginForm.formState.errors.password && (
                        <p className='text-sm text-red-500 mt-1'>
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='remember-me'
                        {...loginForm.register('rememberMe')}
                      />
                      <Label htmlFor='remember-me' className='text-sm'>
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href='/forgot-password'
                      className='text-sm text-blue-600 hover:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button type='submit' className='w-full' disabled={loginLoading}>
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className='mt-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-gray-300' />
                    </div>
                    <div className='relative flex justify-center text-sm'>
                      <span className='px-2 bg-white text-gray-500'>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-3'>
                    <Button variant='outline' className='w-full'>
                      <svg className='w-4 h-4 mr-2' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        />
                        <path
                          fill='currentColor'
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant='outline' className='w-full'>
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.381-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z' />
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value='register'>
              <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>
                  Create Account
                </CardTitle>
                <p className='text-gray-600 text-center'>
                  Get started with Email Builder
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='name'
                        type='text'
                        placeholder='Enter your full name'
                        className='pl-10'
                        {...registerForm.register('name')}
                      />
                      {registerForm.formState.errors.name && (
                        <p className='text-sm text-red-500 mt-1'>
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='reg-email'>Email Address</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='reg-email'
                        type='email'
                        placeholder='Enter your email'
                        className='pl-10'
                        {...registerForm.register('email')}
                      />
                      {registerForm.formState.errors.email && (
                        <p className='text-sm text-red-500 mt-1'>
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='company'>Company Name (Optional)</Label>
                    <div className='relative'>
                      <Building2 className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='company'
                        type='text'
                        placeholder='Enter company name'
                        className='pl-10'
                        {...registerForm.register('companyName')}
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='reg-password'>Password</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='reg-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a password'
                        className='pl-10 pr-10'
                        {...registerForm.register('password')}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='w-4 h-4' />
                        ) : (
                          <Eye className='w-4 h-4' />
                        )}
                      </button>
                      {registerForm.formState.errors.password && (
                        <p className='text-sm text-red-500 mt-1'>
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirm-password'>Confirm Password</Label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                      <Input
                        id='confirm-password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Confirm your password'
                        className='pl-10'
                        {...registerForm.register('confirmPassword')}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className='text-sm text-red-500 mt-1'>
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='agree-terms'
                      {...registerForm.register('agreeToTerms')}
                    />
                    <Label htmlFor='agree-terms' className='text-sm'>
                      I agree to the{' '}
                      <Link
                        href='/terms'
                        className='text-blue-600 hover:underline'
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href='/privacy'
                        className='text-blue-600 hover:underline'
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {registerForm.formState.errors.agreeToTerms && (
                    <p className='text-sm text-red-500'>
                      {registerForm.formState.errors.agreeToTerms.message}
                    </p>
                  )}

                  <Button type='submit' className='w-full' disabled={registerLoading}>
                    {registerLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className='mt-6 text-center text-sm text-gray-600'>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      const tabsList = document.querySelector(
                        '[value="login"]'
                      ) as HTMLElement;
                      tabsList?.click();
                    }}
                    className='text-blue-600 hover:underline font-medium'
                  >
                    Sign in
                  </button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
