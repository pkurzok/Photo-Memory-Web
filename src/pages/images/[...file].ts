// Publishes src/assets/images/** unchanged under /images/…, so that the originals
// exist once and keep the URLs they have always had.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readdir, readFile } from 'node:fs/promises';

const root = 'src/assets/images';
const types: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml' };

const extension = (name: string) => name.split('.').pop() ?? '';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && extension(entry.name) in types)
    .map((entry) => ({ params: { file: `${entry.parentPath}/${entry.name}`.slice(root.length + 1) } }));
};

export const GET: APIRoute = async ({ params }) => {
  const file = params.file!;
  return new Response(new Uint8Array(await readFile(`${root}/${file}`)), {
    headers: { 'Content-Type': types[extension(file)] },
  });
};
