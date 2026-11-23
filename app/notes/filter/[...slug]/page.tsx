import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { notFound } from 'next/navigation';
import NotesClient from '@/app/notes/filter/[...slug]/Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const Notes = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();

  if (tag && !tags.includes(tag)) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default Notes;
