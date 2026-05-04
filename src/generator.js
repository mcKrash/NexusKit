import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateProject(config) {
  const targetDir = path.join(process.cwd(), config.projectName);

  // Step 1: Create project directory
  let spinner = ora('Creating project directory...').start();
  try {
    await fs.ensureDir(targetDir);
    spinner.succeed('Project directory created');
  } catch (error) {
    spinner.fail('Failed to create directory');
    throw error;
  }

  // Step 2: Copy and process templates
  spinner = ora('Generating files from templates...').start();
  try {
    await processTemplates(config, targetDir);
    spinner.succeed('Files generated');
  } catch (error) {
    spinner.fail('Failed to generate files');
    throw error;
  }

  // Log Pro features included
  const proFeatures = [];
  if (config.features?.ai && config.features.ai !== 'none') proFeatures.push(`AI – ${config.features.ai} (${config.features.aiProvider})`);
  if (config.features?.teams) proFeatures.push('Teams & Roles');
  if (config.features?.multiTenancy) proFeatures.push('Multi-tenancy');
  if (config.features?.advancedBilling) proFeatures.push('Advanced Billing');
  if (config.features?.analytics) proFeatures.push('Analytics');
  if (config.features?.onboarding) proFeatures.push('Onboarding');
  if (proFeatures.length > 0) {
    console.log(chalk.cyan(`\n  ⚡ Pro features: ${proFeatures.join(' · ')}`));
  }

  // Step 3: Install dependencies
  if (!config.skipInstall) {
    spinner = ora('Installing dependencies (this may take a few minutes)...').start();
    try {
      await installDependencies(targetDir);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      console.log(chalk.yellow('\nYou can install them manually by running:'));
      console.log(chalk.cyan(`  cd ${config.projectName} && npm install\n`));
    }

    // Run prisma generate after install
    spinner = ora('Generating Prisma client...').start();
    try {
      await execa('npx', ['prisma', 'generate'], { cwd: targetDir });
      spinner.succeed('Prisma client generated');
    } catch (error) {
      spinner.warn('Prisma generate skipped — run "npx prisma generate" manually');
    }
  }

  // Step 4: Initialize git
  if (!config.skipGit) {
    spinner = ora('Initializing git repository...').start();
    try {
      await execa('git', ['init'], { cwd: targetDir });
      await execa('git', ['add', '.'], { cwd: targetDir });
      await execa('git', ['commit', '-m', 'Initial commit from NexusKit'], { cwd: targetDir });
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.warn('Git initialization skipped');
    }
  }
}

async function processTemplates(config, targetDir) {
  const templatesDir = path.join(__dirname, '../templates');

  // Base templates (always)
  await copyAndProcessDir(path.join(templatesDir, 'base'), targetDir, config);

  // Auth templates
  await copyAndProcessDir(
    path.join(templatesDir, 'auth', config.stack.auth),
    targetDir,
    config
  );

  // Payment templates
  await copyAndProcessDir(
    path.join(templatesDir, 'payments', config.stack.payments),
    targetDir,
    config
  );

  // Database templates
  await copyAndProcessDir(
    path.join(templatesDir, 'database', config.stack.database),
    targetDir,
    config
  );

  // Admin dashboard
  if (config.features?.adminDashboard) {
    await copyAndProcessDir(
      path.join(templatesDir, 'admin'),
      targetDir,
      config
    );
  }

  // Docker / deployment
  if (config.features?.docker) {
    await copyAndProcessDir(
      path.join(templatesDir, 'deployment', 'docker'),
      targetDir,
      config
    );
  }

  // ── Pro features ─────────────────────────────────────────────────────────
  const proDir = path.join(templatesDir, 'pro');
  const hasProTemplates = await fs.pathExists(proDir);

  const selectedProFeatures = [
    config.features?.ai && config.features.ai !== 'none' ? `AI (${config.features.ai})` : null,
    config.features?.teams ? 'Teams & RBAC' : null,
    config.features?.multiTenancy ? 'Multi-tenancy' : null,
    config.features?.advancedBilling ? 'Advanced Billing' : null,
    config.features?.analytics ? 'Analytics' : null,
    config.features?.onboarding ? 'Onboarding' : null,
  ].filter(Boolean);

  if (selectedProFeatures.length > 0 && !hasProTemplates) {
    console.log(chalk.yellow('\n  ⚡ Pro features selected — not included in the free version.'));
    console.log(chalk.yellow(`     Skipped: ${selectedProFeatures.join(', ')}`));
    return;
  }

  if (hasProTemplates) {
    if (config.features?.ai && config.features.ai !== 'none') {
      await copyAndProcessDir(path.join(proDir, 'ai', config.features.ai), targetDir, config);
    }
    if (config.features?.teams) {
      await copyAndProcessDir(path.join(proDir, 'teams'), targetDir, config);
    }
    if (config.features?.multiTenancy) {
      await copyAndProcessDir(path.join(proDir, 'multi-tenancy'), targetDir, config);
    }
    if (config.features?.advancedBilling) {
      await copyAndProcessDir(path.join(proDir, 'billing-advanced'), targetDir, config);
    }
    if (config.features?.analytics) {
      await copyAndProcessDir(path.join(proDir, 'analytics'), targetDir, config);
    }
    if (config.features?.onboarding) {
      await copyAndProcessDir(path.join(proDir, 'onboarding'), targetDir, config);
    }
  }
}

async function copyAndProcessDir(sourceDir, targetDir, config) {
  if (!await fs.pathExists(sourceDir)) {
    console.log(chalk.yellow(`\nWarning: Template directory not found: ${sourceDir}`));
    return;
  }

  const files = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    let targetPath = path.join(targetDir, file.name);

    if (file.isDirectory()) {
      await fs.ensureDir(targetPath);
      await copyAndProcessDir(sourcePath, targetPath, config);
    } else {
      if (file.name.endsWith('.hbs')) {
        targetPath = targetPath.replace(/\.hbs$/, '');
      }

      if (file.name.endsWith('.hbs')) {
        const template = await fs.readFile(sourcePath, 'utf8');
        const compiled = Handlebars.compile(template);
        const output = compiled({
          ...config,
          projectName: config.projectName,
          description: `${config.projectName} - Generated by NexusKit`,
          features: {
            ...config.features,
            stripe: config.stack?.payments === 'stripe',
            paddle: config.stack?.payments === 'paddle',
            lemonSqueezy: config.stack?.payments === 'lemon-squeezy',
            resend: config.stack?.email === 'resend',
            sendgrid: config.stack?.email === 'sendgrid',
            postmark: config.stack?.email === 'postmark',
            shadcn: true,
            openai: config.features?.ai !== 'none' && config.features?.aiProvider === 'openai',
            anthropic: config.features?.ai !== 'none' && config.features?.aiProvider === 'anthropic',
            aiBasic: config.features?.ai === 'basic',
            aiPro: config.features?.ai === 'pro',
            teams: config.features?.teams || false,
            multiTenancy: config.features?.multiTenancy || false,
            advancedBilling: config.features?.advancedBilling || false,
            analyticsEnabled: config.features?.analytics || false,
            onboarding: config.features?.onboarding || false,
          }
        });
        await fs.writeFile(targetPath, output);
      } else {
        await fs.copy(sourcePath, targetPath);
      }
    }
  }
}

async function installDependencies(targetDir) {
  let packageManager = 'npm';

  try {
    await execa('pnpm', ['--version']);
    packageManager = 'pnpm';
  } catch {
    try {
      await execa('yarn', ['--version']);
      packageManager = 'yarn';
    } catch {
      packageManager = 'npm';
    }
  }

  await execa(packageManager, ['install'], {
    cwd: targetDir,
    stdio: 'pipe'
  });
}
