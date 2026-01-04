import{Briefcase, CalendarCheck, CheckSquare, ShoppingCart,  Users2, type LucideIcon} from "lucide-react"
import { atom } from "jotai";

export interface TagsItem{
    icon:LucideIcon;
    tag:string
}

export const tags: TagsItem[]=[
    {
    icon:CheckSquare,
    tag:"Todo",
    },
    {
    icon:Briefcase,
    tag:"Work"  
    },
    {
        icon:Users2,
        tag:"Personal",
    },
    {
        icon:CalendarCheck,
        tag:"Meeting"
    },
    {
        icon:ShoppingCart,
        tag:'Shopping'

    }
]




export const isCollapsedAtom=atom(true)