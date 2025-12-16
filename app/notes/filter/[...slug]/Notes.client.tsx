'use client';

import css from './NotesPage.module.css';
import React, { useState } from 'react';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import { NoteTag } from '@/types/note';
import Link from 'next/link';

interface NoteClientProps{
  category:NoteTag | undefined
}

export default function NotesClient({category}:NoteClientProps) {
const [currentPage, setCurrentPage]=useState<number>(1);
const [searchQuery, setSearchQuery]=useState<string>('')


  const updateSearchQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1)
    },
    300
  );

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', {searchQuery:searchQuery, page:currentPage, category: category},],
    queryFn: () => fetchNotes(searchQuery, currentPage, category),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });



  const totalPages=data?.totalPages ?? 0


  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: 'toast-container',
          style: {
            zIndex: 9999,
          },
        }}
      />
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={updateSearchQuery} />
        {isSuccess && totalPages  > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        <Link  className={css.button}  href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {!isLoading && data?.notes.length === 0 && (
  <p>No notes found</p>
)}
   {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
  
    </div>
  );
}
