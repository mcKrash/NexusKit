import { Command } from 'commander';
import chalk from 'chalk';
import { runWizard } from './wizard.js';
import { generateProject } from './generator.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

export async function run() {
  console.log(chalk.bold.cyan('\n🚀 SaaS Boilerplate Generator\n'));

  const program = new Command();

  program
    .name('create-saas-app')
    .description('Generate a production-ready SaaS application')
    .version(packageJson.version)
    .argument('[project-name]', 'name of your project')
    .option('--stack <framework>', 'frontend framework (nextjs)')
    .option('--db <database>', 'database type (postgres, mysql, mongodb)')
    .option('--auth <provider>', 'auth provider (nextauth, clerk, supabase)')
    .option('--payments <provider>', 'payment provider (stripe, paddle, lemon-squeezy)')
    .option('--email <service>', 'email service (resend, sendgrid, postmark)')
    .option('--skip-install', 'skip npm install')
    .option('--skip-git', 'skip git initialization')
    .action(async (projectName, options) => {
      try {
        let config;

        // If project name and all options provided, skip wizard
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
            skipInstall: options.skipInstall || false,
            skipGit: options.skipGit || false
          };
        } else {
          // Run interactive wizard
          config = await runWizard(projectName);
        }

        // Generate the project
        await generateProject(config);

        console.log(chalk.green.bold('\n✨ Your SaaS app is ready!\n'));
        console.log(chalk.white('Next steps:'));
        console.log(chalk.cyan(`  1. cd ${config.projectName}`));
        console.log(chalk.cyan('  2. Copy .env.example to .env and add your API keys'));
        console.log(chalk.cyan('  3. npm run dev'));
        console.log(chalk.cyan('  4. Open http://localhost:3000\n'));
        console.log(chalk.dim('Documentation: ./README.md\n'));
      } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}
