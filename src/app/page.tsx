'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Palette,
  Code,
  Eye,
  Save,
  Download,
  Plus,
  Settings,
  Sparkles,
  Layout,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [stats] = useState({
    templatesCreated: 12,
    emailsSent: 2847,
    activeUsers: 156,
    avgOpenRate: 68.5,
  });

  const features = [
    {
      icon: Layout,
      title: 'Professional Email Editor',
      description:
        'Drag-and-drop email builder with react-email-editor for professional templates',
      color: 'text-blue-600',
    },
    {
      icon: Sparkles,
      title: 'AI Content Generation',
      description: 'Generate email content with AI powered by z-ai-web-dev-sdk',
      color: 'text-purple-600',
    },
    {
      icon: Palette,
      title: 'Customizable Templates',
      description: 'Create and customize email templates for any use case',
      color: 'text-green-600',
    },
    {
      icon: Code,
      title: 'Export & Integration',
      description: 'Export HTML or integrate with your favorite email service',
      color: 'text-orange-600',
    },
  ];

  const recentTemplates = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to our platform!',
      category: 'welcome',
      status: 'published',
    },
    {
      id: '2',
      name: 'Newsletter Template',
      subject: 'Monthly Newsletter - January 2024',
      category: 'newsletter',
      status: 'draft',
    },
    {
      id: '3',
      name: 'Promotional Offer',
      subject: 'Special Offer - 50% Off This Week!',
      category: 'promotional',
      status: 'published',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-6 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h2 className='text-5xl font-bold text-gray-900 mb-6'>
            Build Professional Email Templates
          </h2>
          <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            Create stunning email templates with our powerful drag-and-drop
            editor powered by react-email-editor. Design, preview, and export
            professional emails in minutes.
          </p>

          <div className='flex items-center justify-center gap-4'>
            <Link href='/templates/create'>
              <Button size='lg' className='px-8 py-3'>
                <Plus className='w-5 h-5 mr-2' />
                Create Template
              </Button>
            </Link>
            <Link href='/templates'>
              <Button variant='outline' size='lg' className='px-8 py-3'>
                <Eye className='w-5 h-5 mr-2' />
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-16'>
          <Card className='bg-white/80 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Templates Created
                  </p>
                  <p className='text-3xl font-bold text-gray-900'>
                    {stats.templatesCreated}
                  </p>
                </div>
                <Layout className='w-8 h-8 text-blue-600' />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Emails Sent
                  </p>
                  <p className='text-3xl font-bold text-gray-900'>
                    {stats.emailsSent.toLocaleString()}
                  </p>
                </div>
                <Mail className='w-8 h-8 text-green-600' />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Active Users
                  </p>
                  <p className='text-3xl font-bold text-gray-900'>
                    {stats.activeUsers}
                  </p>
                </div>
                <Users className='w-8 h-8 text-purple-600' />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white/80 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Avg Open Rate
                  </p>
                  <p className='text-3xl font-bold text-gray-900'>
                    {stats.avgOpenRate}%
                  </p>
                </div>
                <TrendingUp className='w-8 h-8 text-orange-600' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className='mb-16'>
          <h3 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Powerful Features
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow'
              >
                <CardContent className='p-8'>
                  <div className='flex items-start gap-4'>
                    <feature.icon
                      className={`w-8 h-8 ${feature.color} flex-shrink-0`}
                    />
                    <div>
                      <h4 className='text-xl font-semibold text-gray-900 mb-2'>
                        {feature.title}
                      </h4>
                      <p className='text-gray-600'>{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Templates */}
        <div className='mb-16'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='text-3xl font-bold text-gray-900'>
              Recent Templates
            </h3>
            <Link href='/templates'>
              <Button variant='outline'>
                View All Templates
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {recentTemplates.map(template => (
              <Card
                key={template.id}
                className='bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-lg'>{template.name}</CardTitle>
                      <p className='text-sm text-gray-500 mt-1'>
                        {template.subject}
                      </p>
                    </div>
                    <Badge
                      variant={
                        template.status === 'published'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <Badge variant='outline' className='text-xs'>
                      {template.category}
                    </Badge>
                    <Link href={`/templates/${template.id}`}>
                      <Button size='sm'>Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white'>
          <h3 className='text-3xl font-bold mb-4'>
            Ready to create amazing emails?
          </h3>
          <p className='text-xl mb-8 opacity-90'>
            Join thousands of users who are already creating professional email
            templates with our builder.
          </p>

          <div className='flex items-center justify-center gap-4'>
            <Link href='/templates/create'>
              <Button size='lg' variant='secondary' className='px-8 py-3'>
                <Plus className='w-5 h-5 mr-2' />
                Get Started Free
              </Button>
            </Link>
            <Button
              size='lg'
              variant='outline'
              className='px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600'
            >
              <Zap className='w-5 h-5 mr-2' />
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
