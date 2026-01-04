
import { nextServer } from './api';
import { Note, NoteFormData, NoteTag } from '@/types/note';
import type {User} from '@/types/user';




// Відповідь від сервера
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера. Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
export const fetchNotes = async (
  
  search: string,
  page: number,
  categoryId?:NoteTag): Promise<FetchNotesResponse> => {
  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { search: search, page: page, perPage: 12, tag:categoryId },
    headers: {},
  });
  return res.data;
};

//createNote: має виконувати запит для створення нової нотатки на сервері. Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
export const createNote = async (newNote: NoteFormData): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", newNote, {
    headers: {},
  });
  return res.data;
};

//deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
export const deleteNote = async (id: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${id}`, {
    headers: {},
  });
  return res.data;
};

//Запит за нотаткою
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {},
  });
  return res.data;
};


export interface RegisterRequest {
  email: string;
  password: string;
}

//register: має виконувати запит для реєстрації нового користувача. Приймає email та пароль, повертає інформацію про створеного користувача;
export const register = async (
  data: RegisterRequest 
) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};


export interface LoginRequest {
  email: string;
  password: string;
}       

//login: має виконувати запит для автентифікації користувача. Приймає email та пароль, повертає інформацію про автентифікованого користувача;
export const login = async (
  data: LoginRequest        
): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data, {
    headers: {},
  });
  return res.data;
}

//getMe: має виконувати запит для отримання інформації про поточного автентифікованого користувача;
export const getMe = async () => {
  const{data} = await nextServer.get<User>("/users/me")
  return data;
};

//logout: має виконувати запит для виходу користувача з системи.
export const logout = async (): Promise<void> => {
await nextServer.post("/auth/logout")
}

export interface CheckSessionResponse  {
  success: boolean;
}
//checkSession: має виконувати запит для перевірки дійсності сесії користувача.
export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionResponse>("/auth/session");
    return res.data.success;    
};

export interface  UpdateUserRequest {
  email?: string;
  username?: string;
  avatar?: string;
}
//updateUser: має виконувати запит для оновлення інформації про користувача. Приймає оновлені дані користувача та повертає оновлену інформацію у відповіді.
export const updateMe = async (
  payload: UpdateUserRequest  
)=> {
  const res = await nextServer.patch<User>("/users/me", payload)
  return res.data;
};