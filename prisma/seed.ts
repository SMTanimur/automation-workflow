
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';



async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.edge.deleteMany();
  await prisma.node.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create workflow first
  const workflow = await prisma.workflow.create({
    data: {
      name: 'Welcome Email Series',
      description: 'Send welcome email to new users',
      isActive: true,
      userId: user.id,
    },
  });

  // Create nodes
  const nodes = await prisma.node.createMany({
    data: [
      {
        type: 'trigger',
        positionX: 100,
        positionY: 100,
        data: JSON.stringify({
          label: 'Start',
          event: 'user_signup',
          config: {
            triggerType: 'user_signup',
            conditions: [],
          },
        }),
        workflowId: workflow.id,
      },
      {
        type: 'email',
        positionX: 300,
        positionY: 100,
        data: JSON.stringify({
          label: 'Welcome Email',
          templateId: '1',
          config: {
            to: '{{user.email}}',
            subject: 'Welcome to our platform!',
            template: 'welcome-template',
          },
        }),
        workflowId: workflow.id,
      },
      {
        type: 'delay',
        positionX: 500,
        positionY: 100,
        data: JSON.stringify({
          label: 'Wait 2 days',
          config: {
            delay: 2,
            delayUnit: 'days',
          },
        }),
        workflowId: workflow.id,
      },
      {
        type: 'email',
        positionX: 700,
        positionY: 100,
        data: JSON.stringify({
          label: 'Follow-up Email',
          templateId: '2',
          config: {
            to: '{{user.email}}',
            subject: 'How are you enjoying our platform?',
            template: 'followup-template',
          },
        }),
        workflowId: workflow.id,
      },
      {
        type: 'end',
        positionX: 900,
        positionY: 100,
        data: JSON.stringify({
          label: 'End',
          config: {},
        }),
        workflowId: workflow.id,
      },
    ],
  });

  // Get the created nodes to reference their IDs
  const createdNodes = await prisma.node.findMany({
    where: { workflowId: workflow.id },
    orderBy: { positionX: 'asc' },
  });

  // Create edges using actual node IDs
  if (createdNodes.length >= 5) {
    await prisma.edge.createMany({
      data: [
        {
          sourceId: createdNodes[0].id,
          targetId: createdNodes[1].id,
          workflowId: workflow.id,
        },
        {
          sourceId: createdNodes[1].id,
          targetId: createdNodes[2].id,
          workflowId: workflow.id,
        },
        {
          sourceId: createdNodes[2].id,
          targetId: createdNodes[3].id,
          workflowId: workflow.id,
        },
        {
          sourceId: createdNodes[3].id,
          targetId: createdNodes[4].id,
          workflowId: workflow.id,
        },
      ],
    });
  }

  console.log('✅ Created sample workflow:', workflow.name);

  await prisma.emailTemplate.createMany({
    data: [
      {
        name: 'Welcome Email',
        subject: 'Welcome to our platform!',
        content:
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Welcome Email</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #2563eb; text-align: center;">Welcome to our platform!</h1><p>Hi {{user.name}},</p><p>We are excited to have you on board.</p><div style="text-align: center; margin: 30px 0;"><a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a></div></div></body></html>',
        design:
          '{"body":{"backgroundColor":"#ffffff","content":[{"type":"text","content":"<h1>Welcome to our platform!</h1>","styles":{"fontSize":"24px","color":"#2563eb","textAlign":"center"}},{"type":"text","content":"<p>Hi {{user.name}}, we are excited to have you on board.</p>","styles":{"fontSize":"16px","color":"#333333"}},{"type":"button","content":"Get Started","styles":{"backgroundColor":"#2563eb","color":"#ffffff","padding":"12px 24px","borderRadius":"6px"}}]}}',
          
        userId: user.id,
      },
      {
        name: 'Follow-up Email',
        subject: 'How are you enjoying our platform?',
        content:
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Follow-up Email</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #059669; text-align: center;">How are you enjoying our platform?</h1><p>Hi {{user.name}},</p><p>It has been a couple of days since you joined us.</p><div style="text-align: center; margin: 30px 0;"><a href="{{tutorialsUrl}}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Tutorials</a></div></div></body></html>',
        design:
          '{"body":{"backgroundColor":"#ffffff","content":[{"type":"text","content":"<h1>How are you enjoying our platform?</h1>","styles":{"fontSize":"24px","color":"#059669","textAlign":"center"}},{"type":"text","content":"<p>Hi {{user.name}}, we would love to hear about your experience.</p>","styles":{"fontSize":"16px","color":"#333333"}},{"type":"button","content":"View Tutorials","styles":{"backgroundColor":"#059669","color":"#ffffff","padding":"12px 24px","borderRadius":"6px"}}]}}',
        userId: user.id,
      }, 
    ],
  });

  console.log('✅ Created sample email templates');

  // Create additional users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 12),
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: await bcrypt.hash('test123', 12),
    },
  });

  console.log('✅ Created additional demo users');
  console.log('🎉 Database seeding completed!');
  console.log('Demo credentials:');
  console.log('Email: demo@example.com, Password: password123');
  console.log('Email: admin@example.com, Password: admin123');
  console.log('Email: test@example.com, Password: test123');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
