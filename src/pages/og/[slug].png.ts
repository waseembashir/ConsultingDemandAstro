import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { generateOgSvg } from '../../lib/og-template';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, '') },
    props: { title: post.data.title, category: post.data.category },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, category } = props as { title: string; category: string };
  const svg = await generateOgSvg(title, category);

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
