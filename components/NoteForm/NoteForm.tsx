"use client"


import { useMutation, useQueryClient} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import type { NoteFormData } from '@/types/note';
import toast from 'react-hot-toast';
import css from './NoteForm.module.css';
import { useNoteDraftStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const router=useRouter();
  const queryClient=useQueryClient();
  const {draft, setDraft, clearDraft}=useNoteDraftStore();


  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['notes']});
      clearDraft();
         toast.success('Note added successfully');
      router.push('/notes/filter/all');
    },
    onError: error => {
      console.log('Error', error);
      toast.error('An error occurred');
    },
  });

const handleChange=(
  e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
    setDraft({
      ...draft,
      [e.target.name]:e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


  const formData ={
    title:String(draft?.title ?? ''),
      content:String(draft?.content ?? ''),
      tag:String(draft?.tag ?? ''),
  } as NoteFormData;
    mutation.mutate(formData);
  };

  const handlerCancel=()=>router.back()

  return (
    <>
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" name="title" className={css.input} value={draft?.title ?? ''} onChange={handleChange} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              value={draft?.content??''}
              onChange={handleChange}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select  id="tag" name="tag" className={css.select} value={draft?.tag ?? 'Todo'} onChange={handleChange}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handlerCancel}
            >
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
              Create note
            </button>
          </div>
        </form>
     
      {mutation.isPending && <div>Adding note...</div>}
    </>
  );
}
