/**
 * ══════════════════════════════════════════════════════
 *  CADMarket — Database Reset Script
 *  Usage: node scripts/reset-db.js [--confirm] [--keep-products]
 *
 *  Flags:
 *    --confirm        Skip the interactive prompt (useful in CI)
 *    --keep-products  Delete users/orders/admins but keep products
 *
 *  Examples:
 *    node scripts/reset-db.js               ← interactive prompt
 *    node scripts/reset-db.js --confirm     ← no prompt, full wipe
 *    node scripts/reset-db.js --confirm --keep-products
 * ══════════════════════════════════════════════════════
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

// ── Models ──────────────────────────────────────────────────────────
const Admin   = require('../models/Admin');
const User    = require('../models/User');
const Order   = require('../models/Order');
const Product = require('../models/Product');

// ── CLI flags ────────────────────────────────────────────────────────
const args        = process.argv.slice(2);
const noPrompt    = args.includes('--confirm');
const keepProducts = args.includes('--keep-products');

// ── Helpers ──────────────────────────────────────────────────────────
function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve =>
    rl.question(question, ans => { rl.close(); resolve(ans.trim()); })
  );
}

function log(emoji, msg) { console.log(`${emoji}  ${msg}`); }
function section(title) { console.log(`\n${'─'.repeat(50)}\n  ${title}\n${'─'.repeat(50)}`); }

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  section('CADMarket — Database Reset');

  if (!process.env.MONGODB_URI) {
    log('❌', 'MONGODB_URI not set in .env');
    process.exit(1);
  }

  log('🔌', `Connecting to: ${process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@')}`);
  await mongoose.connect(process.env.MONGODB_URI);
  const dbName = mongoose.connection.db.databaseName;
  log('✅', `Connected to database: ${dbName}`);

  // ── Confirm ─────────────────────────────────────────────────────────
  if (!noPrompt) {
    console.log('\n⚠️  WARNING: This will permanently delete:');
    console.log('   • All Admins');
    console.log('   • All Users');
    console.log('   • All Orders');
    if (!keepProducts) console.log('   • All Products');
    console.log(`\n   Database: ${dbName}\n`);

    const answer = await ask('Type "yes" to continue, anything else to abort: ');
    if (answer.toLowerCase() !== 'yes') {
      log('🚫', 'Aborted. No changes made.');
      await mongoose.disconnect();
      process.exit(0);
    }
  }

  section('Deleting Collections');

  // ── Delete Orders ────────────────────────────────────────────────────
  const orderResult = await Order.deleteMany({});
  log('🗑️ ', `Orders deleted:   ${orderResult.deletedCount}`);

  // ── Delete Users ─────────────────────────────────────────────────────
  const userResult = await User.deleteMany({});
  log('🗑️ ', `Users deleted:    ${userResult.deletedCount}`);

  // ── Delete Admins ────────────────────────────────────────────────────
  const adminResult = await Admin.deleteMany({});
  log('🗑️ ', `Admins deleted:   ${adminResult.deletedCount}`);

  // ── Delete Products (unless --keep-products) ─────────────────────────
  if (!keepProducts) {
    const productResult = await Product.deleteMany({});
    log('🗑️ ', `Products deleted: ${productResult.deletedCount}`);
  } else {
    log('⏭️ ', 'Products kept (--keep-products flag)');
  }

  section('Re-seeding Admin');

  // ── Seed fresh admin ─────────────────────────────────────────────────
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    log('⚠️ ', 'ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed');
  } else {
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    log('✅', `Admin created: ${admin.email}`);
    log('🔑', `Password:      ${process.env.ADMIN_PASSWORD}`);
  }

  section('Done');
  log('✅', 'Database reset complete.');
  log('ℹ️ ', 'Restart the server: npm run dev');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌ Reset failed:', err.message);
  process.exit(1);
});
