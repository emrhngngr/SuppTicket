import { ArrowRight, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Swal from "sweetalert2";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use React Router's navigation

  interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
    user?: Record<string, any>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: formData,
      });
  
      const data: LoginResponse = await res.json();
      console.log("data: ", data);
  
      if (res.ok && data.success) {
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        
        Swal.fire({
          title: "Başarılı!",
          text: "Başarıyla giriş yaptınız.",
          icon: "success",
          confirmButtonText: "Tamam",
        });
        
        // Use React Router navigation instead of window.location
        navigate('/dashboard');
      } else {
        Swal.fire({
          title: "Hata!",
          text: data.message || "Giriş sırasında bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Hata!",
        text: "Sunucuya bağlanırken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };
  

  return (
    <div className="flex justify-between min-h-screen h-full w-full gap-x-12">
      <div className="flex flex-col justify-center w-full px-4 py-12 md:pl-12 lg:pl-24 xl:pl-32">
        <div className="flex justify-center flex-col gap-y-4 max-w-sm mx-auto lg:mx-0">
          <h1 className="text-4xl font-bold">Giriş Yap</h1>

          <form
            className="flex flex-col gap-y-4 mt-4 w-full text-gray-500 dark:text-gray-400"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-1">
              <span className="text-xl">Email</span>
              <div className="group flex items-center gap-x-2 border border-black/35 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:text-blue-600">
                <label htmlFor="email">
                  <Mail className="size-4" />
                </label>

                <input
                  type="text"
                  className="w-full bg-transparent text-black font-normal placeholder:font-light group-focus-within:text-blue-600"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-xl">Şifre</span>
              <div className="group flex items-center gap-x-2 border border-black/35 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:text-blue-600">
                <label htmlFor="password">
                  <Lock className="size-4" />
                </label>

                <input
                  type="password"
                  className="w-full bg-transparent text-black font-normal placeholder:font-light border border-transparent"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="submit"
                  className="text-sm"
                  tabIndex={-1}
                ></button>
              </div>
            </div>

            <button
              type="submit"
              className="relative flex items-center justify-center text-lg font-medium px-4 py-2 rounded-lg mt-4 text-white bg-blue-600 hover:bg-blue-700"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="absolute right-4 size-5" />
            </button>
          </form>
        </div>
        </div>
    </div>
  );
};

export default LoginPage;