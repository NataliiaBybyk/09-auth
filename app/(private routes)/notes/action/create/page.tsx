
import css from "./CreateNote.module.css"
import NoteForm from "@/components/NoteForm/NoteForm" 
import type { Metadata } from "next"

export const metadata:Metadata={
    title:"Create Note",
    description:"Create new note!",
    openGraph:{
          title:"Create Note",
    description:"Create new note!",
    url:`https://08-zustand-orcin-eight.vercel.app/notes/action/create`,
images:[
  {
    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
    width: 1200,
    height: 630,
    alt: "Create Note"
  },
],
    },
}


 function CreateNote(){
   
    return (
        <main className={css.main}>
  <div className={css.container}>
    <h1 className={css.title}>Create note</h1>
	   <NoteForm/>
  </div>
</main>
    )
}

export default CreateNote

