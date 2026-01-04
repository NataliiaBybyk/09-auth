import { nextServer } from './api';
import type {User} from '@/types/user';   
import { Note,  NoteTag } from '@/types/note';
import { CheckSessionResponse,  FetchNotesResponse } from './clientApi';
import { cookies } from 'next/headers';


export const fetchNotes = async (
  search: string,
    page: number,
    categoryId?:NoteTag): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

    const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { search: search, page: page, perPage: 12, tag:categoryId },
    headers: {
        Cookie: cookieStore.toString(),
    },
  });
  return res.data;
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
    const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
        Cookie: cookieStore.toString(),
    },
  });
  return res.data;
}

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
    const {data} = await nextServer.get<User>("/users/me", {    
    headers: {
        Cookie: cookieStore.toString(),
    },
  });
  return data;
}


export const checkServerSession = async ()=> {
  const cookieStore = await cookies();
    const res = await nextServer.get<CheckSessionResponse>("/auth/session", { 
    headers: {
        Cookie: cookieStore.toString(),
    },
  });
  return res;
}
