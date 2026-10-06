/**
 * Migrasi gambar dari ImageKit ke penyimpanan lokal VPS (backend/uploads).
 *
 * Cara pakai (jalankan dari folder backend, di VPS):
 *   npx ts-node scripts/migrate-imagekit-to-local.ts           # dry-run (hanya laporan)
 *   npx ts-node scripts/migrate-imagekit-to-local.ts --apply   # download + update DB
 *
 * Script ini:
 *  1. Memindai kolom URL gambar & kolom markdown (content) di semua tabel terkait.
 *  2. Mengunduh setiap URL ik.imagekit.io ke folder ./uploads.
 *  3. Mengganti URL di database menjadi /uploads/<nama-file>.
 * Baris yang gagal diunduh sebagian tidak diubah sama sekali (aman diulang).
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

const APPLY = process.argv.includes('--apply');
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// tabel -> kolom yang mungkin berisi URL ImageKit (kolom langsung atau teks markdown)
const TARGETS: { table: string; columns: string[] }[] = [
  { table: 'projects', columns: ['imageUrl', 'content'] },
  { table: 'blogs', columns: ['coverImageUrl', 'content'] },
  { table: 'awards', columns: ['imageUrl'] },
  { table: 'profile', columns: ['avatarUrl'] },
  { table: 'academics', columns: ['logoUrl'] },
  { table: 'experiences', columns: ['logoUrl'] },
  { table: 'organizations', columns: ['logoUrl'] },
];

const IK_REGEX = /https?:\/\/ik\.imagekit\.io\/[^\s`"')<>\]]+/g;

function localNameFor(url: string): string {
  const u = new URL(url);
  const base = decodeURIComponent(basename(u.pathname));
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

const cache = new Map<string, string>(); // url -> /uploads/name

async function fetchToLocal(url: string): Promise<string> {
  const hit = cache.get(url);
  if (hit) return hit;

  const name = localNameFor(url);
  const rel = `/uploads/${name}`;
  const target = join(UPLOAD_DIR, name);

  if (existsSync(target)) {
    cache.set(url, rel);
    return rel;
  }

  // unduh file asli (tanpa query transformasi)
  const clean = url.split('?')[0];
  const res = await fetch(clean);
  if (!res.ok) throw new Error(`HTTP ${res.status} untuk ${clean}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (APPLY) writeFileSync(target, buf);
  cache.set(url, rel);
  return rel;
}

async function main() {
  console.log(APPLY ? '== MODE APPLY ==' : '== DRY-RUN (tambahkan --apply untuk menjalankan) ==');
  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

  const ds = new DataSource(
    process.env.DATABASE_URL
      ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          extra: { ssl: { rejectUnauthorized: false } },
        }
      : { type: 'sqlite', database: join(process.cwd(), 'database.sqlite') },
  );
  await ds.initialize();
  const q = (n: string) => '"' + n + '"';

  let found = 0;
  let migrated = 0;
  let failedRows = 0;

  for (const { table, columns } of TARGETS) {
    let rows: any[];
    try {
      const cols = columns.map(q).join(', ');
      rows = await ds.query(`SELECT id, ${cols} FROM ${q(table)}`);
    } catch (e: any) {
      console.log(`- lewati tabel ${table}: ${e.message}`);
      continue;
    }

    for (const row of rows) {
      const updates: Record<string, string> = {};
      let rowFailed = false;

      for (const col of columns) {
        const value: string | null = row[col];
        if (!value || typeof value !== 'string') continue;
        const urls = Array.from(new Set(value.match(IK_REGEX) || []));
        if (urls.length === 0) continue;

        let next = value;
        for (const url of urls) {
          found++;
          try {
            const rel = await fetchToLocal(url);
            next = next.split(url).join(rel);
            console.log(`  [${table}#${row.id}.${col}] ${url} -> ${rel}`);
          } catch (e: any) {
            rowFailed = true;
            console.error(`  GAGAL [${table}#${row.id}.${col}] ${url}: ${e.message}`);
          }
        }
        if (next !== value) updates[col] = next;
      }

      if (rowFailed) {
        failedRows++;
        continue; // jangan ubah baris yang sebagian gagal
      }

      const keys = Object.keys(updates);
      if (keys.length === 0) continue;
      migrated += keys.length;

      if (APPLY) {
        const isPg = ds.options.type === 'postgres';
        const set = keys.map((k, i) => `${q(k)} = ${isPg ? `$${i + 1}` : '?'}`).join(', ');
        const idPlaceholder = isPg ? `$${keys.length + 1}` : '?';
        await ds.query(`UPDATE ${q(table)} SET ${set} WHERE id = ${idPlaceholder}`, [
          ...keys.map((k) => updates[k]),
          row.id,
        ]);
      }
    }
  }

  await ds.destroy();
  console.log(
    `\nSelesai. URL ditemukan: ${found}, kolom ${APPLY ? 'diupdate' : 'akan diupdate'}: ${migrated}, baris gagal: ${failedRows}`,
  );
  if (!APPLY) console.log('Jalankan ulang dengan --apply untuk menerapkan.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
