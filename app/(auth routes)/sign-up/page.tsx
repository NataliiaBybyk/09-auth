"use client"
import css from "./SignUpPage.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {register, RegisterRequest} from "@/lib/api/clientApi"
import { ApiError } from "@/app/api/api"
import { useAuthStore } from "@/lib/store/authStore"

function SignUp() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");


    const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = {
        email: formData.get("email"),
        password: formData.get("password"),
      } as RegisterRequest;

      const res = await register(formValues);

      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          "Oops... some error"
      );
    }
  };

        return (
            <main className={css.mainContent}>
                <form className={css.form} action={handleSubmit}>
  <h1 className={css.formTitle}>Sign up</h1>
    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" className={css.input} required />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" className={css.input} required />
    </div>

    <div className={css.actions}>
      <button type="submit" className={css.submitButton}>
        Register
      </button>
    </div>

   {error && <p className={css.error}>{error}</p>}
  </form>
</main>
        )
    }
export default SignUp