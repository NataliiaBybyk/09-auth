"use client"
import css from "./SidebarNotes.module.css"
import { tags } from "./tags.data";
import Link from "next/link";
import { useAtom } from "jotai";
import { isCollapsedAtom } from "./tags.data";

import { motion } from "framer-motion"
import cn from 'clsx'
import { Crown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';



export default function SidebarNotes(){
    // const tags =["Todo", "Work", "Personal", "Meeting", "Shopping"];
const [isCollapsed, setIsCollapsed]=useAtom(isCollapsedAtom)

const toggleSidebar=()=>{
    setIsCollapsed(!isCollapsed)
}
    return(
        <motion.aside className={cn(css.sidebar, {
            [css.collapsed]:isCollapsed
        })}
        animate={{width:isCollapsed ? 70:220}}
            transition={{type:'spring', stiffness:300, damping:29 }}
        >
      
    <button className={css.toggle} onClick={toggleSidebar}>{isCollapsed ? <PanelLeftOpen size={30}/> : <PanelLeftClose size={30} />}</button>
<ul className={css.menuList}>
      <li className={css.menuItem}>
 <Link href={`/notes/filter/all`} className={css.menuLink}>
  <span className={css.iconBox}>
      <Crown size={28} />
    </span>


          {!isCollapsed && <span>All notes</span>}
 </Link>
</li>
{tags.map(({icon: Icon,  tag})=>(
    <li key={tag} >
        <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
      
        <Icon size={28} />
     
          {/* <Icon size={30}/> */}
          {!isCollapsed && <span>{tag}</span>}
        </Link>
      </li>
))}
      
    </ul>
        </motion.aside>
          

    )
}

