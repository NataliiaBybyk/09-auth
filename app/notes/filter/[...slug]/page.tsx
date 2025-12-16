import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';
import { Metadata } from 'next';


 export const generateMetadata =async ({ params }:  Props):Promise<Metadata>=>{
  const{slug}=await params;
 const category = slug[0] === 'all' ? 'All Notes' : slug[0];

return {
  title: `Notes: ${category}`,
 description: `Viewing notes in the ${category} category.`,
 openGraph:{
title:`Notes: ${category}`,
description: `Viewing notes in the ${category} category.`,
url: `https://08-zustand-orcin-eight.vercel.app/notes/filter/${category}`,   
 images:[
  {
    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
    width: 1200,
    height: 630,
    alt: `Notes: ${category}`
  }
 ]


 }
}

 }





type Props = {
  params: Promise<{ slug: [NoteTag | 'all'] }>;
};

export default async function Notes({ params }: Props) {
  const { slug } = await params;
  const category = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

 await queryClient.prefetchQuery({
  queryKey: ['notes', { search: '', page: 1, category }],
  queryFn: () => fetchNotes('', 1, category),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}
