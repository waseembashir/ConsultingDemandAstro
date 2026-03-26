import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { generateCoverSvg } from '../../lib/cover/index';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, '') },
    props: { slug: post.id.replace(/\.(md|mdx)$/, ''), category: post.data.category },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { slug, category } = props as { slug: string; category: string };
  const svg = await generateCoverSvg(slug, category);

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
