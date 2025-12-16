import css from './Home.module.css'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Page Not Found - NoteHub',
  description: 'The page you are looking for does not exist',
  openGraph:{
    title: 'Page Not Found - NoteHub',
  description: 'The page you are looking for does not exist',
  url:"https://08-zustand-orcin-eight.vercel.app/notes",
   images:[
  {
    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
    width: 1200,
    height: 630,
    alt: "Page Not Found - NoteHub"
  }
 ]
  }
 
};

function NotFound(){
    return (
        <div>
            <h1 className={css.title}>404 - Page not found</h1>
            <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
        </div>
        
    )
}

export default NotFound