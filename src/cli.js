import { Command } from 'commander';
import chalk from 'chalk';
import { runWizard } from './wizard.js';
import { generateProject } from './generator.js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

export async function run() {
  console.log(chalk.bold.green('\n⚡ NexusKit — Production SaaS Generator\n'));

  const program = new Command();

  program
    .name('nexuskit-cli')
    .description('Generate a complete, production-ready SaaS application')
    .version(packageJson.version)
    .argument('[project-name]', 'name of your project')
    .option('--stack <framework>', 'frontend framework (nextjs)')
    .option('--db <database>', 'database type (postgres, mysql, mongodb)')
    .option('--auth <provider>', 'auth provider (nextauth, clerk, supabase)')
    .option('--payments <provider>', 'payment provider (stripe, paddle, lemon-squeezy)')
    .option('--email <service>', 'email service (resend, sendgrid, postmark)')
    .option('--pro', 'enable Pro tier features (teams, AI, multi-tenancy, advanced billing)')
    .option('--skip-install', 'skip npm install')
    .option('--skip-git', 'skip git initialization')
    .action(async (projectName, options) => {
      try {
        let config;

        if (projectName && options.stack && options.db && options.auth && options.payments) {
          config = {
            projectName,
            stack: {
              frontend: options.stack,
              database: options.db,
              auth: options.auth,
              payments: options.payments,
              email: options.email || 'resend'
            },
            features: {
              adminDashboard: true,
              docker: true,
              ai: 'none',
              aiProvider: null,
              teams: false,
              multiTenancy: false,
              advancedBilling: false,
              analytics: false,
              onboarding: false,
            },
            skipInstall: options.skipInstall || false,
            skipGit: options.skipGit || false
          };
        } else {
          config = await runWizard(projectName);
        }

        await generateProject(config);

        console.log(chalk.green.bold('\n✨ Your SaaS app is ready!\n'));
        console.log(chalk.white('Next steps:'));
        console.log(chalk.cyan(`  1. cd ${config.projectName}`));
        console.log(chalk.cyan('  2. cp .env.example .env.local  →  fill in your API keys'));
        console.log(chalk.cyan('  3. npx prisma db push'));
        console.log(chalk.cyan('  4. npm run dev'));
        console.log(chalk.cyan('  5. Open http://localhost:3000\n'));

        const proCount = [
          config.features?.teams,
          config.features?.multiTenancy,
          config.features?.advancedBilling,
          config.features?.analytics,
          config.features?.onboarding,
        ].filter(Boolean).length + (config.features?.ai && config.features.ai !== 'none' ? 1 : 0);

        if (proCount > 0) {
          console.log(chalk.bold.cyan(`⚡ ${proCount} Pro feature${proCount > 1 ? 's' : ''} included.`));
          console.log(chalk.dim('   Review lib/ai.ts, lib/teams.ts, and lib/billing.ts for setup details.\n'));
        }

        console.log(chalk.dim('Documentation: ./README.md\n'));

        const hasProTemplates = existsSync(join(__dirname, '../templates/pro'));
        if (!hasProTemplates) {
          console.log(chalk.dim('─'.repeat(52)));
          console.log(chalk.bold.yellow('\n  ⚡ NexusKit Pro — $49 one-time\n'));
          console.log(chalk.white('  Unlock 6 production-ready feature modules:'));
          console.log(chalk.white('  Multi-tenancy · Teams & RBAC · AI (GPT-4o + Claude)'));
          console.log(chalk.white('  Advanced billing · Analytics · Onboarding flows\n'));
          console.log(chalk.cyan('  → nexuskit-pro.gumroad.com\n'));
          console.log(chalk.dim('─'.repeat(52) + '\n'));
        }
      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}
