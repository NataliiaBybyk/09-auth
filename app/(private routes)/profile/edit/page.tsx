"use client";
import css from "./EditProfilePage.module.css"
import Image from "next/image";

import { checkSession, getMe, updateMe } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

function EditProfile() {
    const router= useRouter();
    const user=useAuthStore((state)=>state.user);
    const setUser=useAuthStore((state)=>state.setUser);
    

    const handleSubmit=async(formData:FormData)=>{
      try{
        const username=formData.get('username') as string;
        if(username.trim()){
          const newData=await updateMe({username});
          setUser(newData);
          router.push("/profile");
        }
      }catch(error){
        console.log('Error updating profile', error);
        }
      }
    
    return (
      <>
      {user && (
      <main className={css.mainContent}>
  <div className={css.profileCard}>
    <h1 className={css.formTitle}>Edit Profile</h1>

    <Image src={user.avatar}
      alt="User Avatar"
      width={120}
      height={120}
      className={css.avatar}
    />

     <form className={css.profileInfo} action={handleSubmit}>
      <div className={css.usernameWrapper}>
        <label htmlFor="username">Username:</label>
        <input id="username"
          type="text"
          className={css.input}
          name="username"
          defaultValue={user.username}
    
        />
      </div>

      <p>Email: {user.email}</p>

      <div className={css.actions}>
        <button type="submit" className={css.saveButton}>
          Save
        </button>
        <button type="button" className={css.cancelButton} onClick={()=>router.push("/profile")}>
          Cancel
        </button>
      </div>
    </form>
  </div>
</main>
      )}
      </>
  
    );
}       
export default EditProfile;
