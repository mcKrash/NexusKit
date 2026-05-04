import inquirer from 'inquirer';
import validateNpmPackageName from 'validate-npm-package-name';
import chalk from 'chalk';
import { existsSync } from 'fs';
import { join } from 'path';

export async function runWizard(initialProjectName) {
  console.log(chalk.dim('Answer a few questions to configure your SaaS app:\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: initialProjectName || 'my-saas-app',
      validate: (input) => {
        const validation = validateNpmPackageName(input);
        if (!validation.validForNewPackages) {
          return validation.errors ? validation.errors[0] : 'Invalid project name';
        }
        if (existsSync(join(process.cwd(), input))) {
          return `Directory "${input}" already exists. Please choose a different name.`;
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'frontend',
      message: 'Choose your frontend framework:',
      choices: [
        { name: 'Next.js 14 (Recommended)', value: 'nextjs', short: 'Next.js' },
        { name: 'React + Vite', value: 'react-vite', short: 'React' },
        { name: 'SvelteKit', value: 'sveltekit', short: 'Svelte' }
      ],
      default: 'nextjs'
    },
    {
      type: 'list',
      name: 'database',
      message: 'Choose your database:',
      choices: [
        { name: 'PostgreSQL (Recommended)', value: 'postgresql', short: 'PostgreSQL' },
        { name: 'MySQL', value: 'mysql', short: 'MySQL' },
        { name: 'SQLite', value: 'sqlite', short: 'SQLite' },
        { name: 'MongoDB', value: 'mongodb', short: 'MongoDB' }
      ],
      default: 'postgresql'
    },
    {
      type: 'list',
      name: 'auth',
      message: 'Choose your auth provider:',
      choices: [
        { name: 'NextAuth.js (Recommended - Free)', value: 'nextauth', short: 'NextAuth' },
        { name: 'Clerk ($25/month)', value: 'clerk', short: 'Clerk' },
        { name: 'Supabase Auth (Free)', value: 'supabase', short: 'Supabase' }
      ],
      default: 'nextauth'
    },
    {
      type: 'list',
      name: 'payments',
      message: 'Choose your payment provider:',
      choices: [
        { name: 'Stripe (Recommended - 2.9% + $0.30)', value: 'stripe', short: 'Stripe' },
        { name: 'Paddle (5% + $0.50)', value: 'paddle', short: 'Paddle' },
        { name: 'LemonSqueezy (5% + $0.50)', value: 'lemon-squeezy', short: 'LemonSqueezy' }
      ],
      default: 'stripe'
    },
    {
      type: 'list',
      name: 'email',
      message: 'Choose your email service:',
      choices: [
        { name: 'Resend (Recommended - 100/day free)', value: 'resend', short: 'Resend' },
        { name: 'SendGrid (100/day free)', value: 'sendgrid', short: 'SendGrid' },
        { name: 'Postmark (100/month free)', value: 'postmark', short: 'Postmark' }
      ],
      default: 'resend'
    },
    {
      type: 'confirm',
      name: 'includeAdmin',
      message: 'Include admin dashboard?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Include Docker configuration?',
      default: true
    },
    // ── Pro Features ──────────────────────────────────────────────────────────
    {
      type: 'confirm',
      name: 'includeAI',
      message: 'Add AI integration? (streaming chat, API routes)',
      default: false
    },
    {
      type: 'list',
      name: 'aiProvider',
      message: 'Choose AI provider:',
      when: (answers) => answers.includeAI,
      choices: [
        { name: 'OpenAI (GPT-4o)', value: 'openai' },
        { name: 'Anthropic (Claude Sonnet)', value: 'anthropic' }
      ],
      default: 'openai'
    },
    {
      type: 'list',
      name: 'aiTier',
      message: 'Choose AI tier:',
      when: (answers) => answers.includeAI,
      choices: [
        { name: 'Basic – Free  (streaming chat route, API setup)', value: 'basic' },
        { name: 'Pro  – Full Layer (token tracking, rate limiting, cost analytics)', value: 'pro' }
      ],
      default: 'basic'
    },
    {
      type: 'confirm',
      name: 'includeTeams',
      message: 'Include Teams & Roles? (organizations, member invites, RBAC)',
      default: false
    },
    {
      type: 'confirm',
      name: 'includeMultiTenancy',
      message: 'Include Multi-tenancy? (subdomain routing, tenant isolation)',
      when: (answers) => answers.includeTeams,
      default: false
    },
    {
      type: 'confirm',
      name: 'includeAdvancedBilling',
      message: 'Include Advanced Billing? (usage-based metering, seats, free trials)',
      default: false
    },
    {
      type: 'confirm',
      name: 'includeAnalytics',
      message: 'Include Analytics Dashboard? (MRR, churn, cohort analysis)',
      default: false
    },
    {
      type: 'confirm',
      name: 'includeOnboarding',
      message: 'Include Onboarding Flows? (user checklists, empty states, product tours)',
      default: false
    },
    // ─────────────────────────────────────────────────────────────────────────
    {
      type: 'confirm',
      name: 'skipInstall',
      message: 'Skip npm install?',
      default: false
    }
  ]);

  return {
    projectName: answers.projectName,
    stack: {
      frontend: answers.frontend,
      database: answers.database,
      auth: answers.auth,
      payments: answers.payments,
      email: answers.email
    },
    features: {
      adminDashboard: answers.includeAdmin,
      docker: answers.includeDocker,
      ai: answers.includeAI ? answers.aiTier : 'none',
      aiProvider: answers.includeAI ? answers.aiProvider : null,
      teams: answers.includeTeams || false,
      multiTenancy: answers.includeMultiTenancy || false,
      advancedBilling: answers.includeAdvancedBilling || false,
      analytics: answers.includeAnalytics || false,
      onboarding: answers.includeOnboarding || false,
    },
    skipInstall: answers.skipInstall,
    skipGit: false
  };
}
