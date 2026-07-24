"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Input, Button, Separator } from "@heroui/react";
import { Eye, EyeOff, Image as ImageIcon, Upload } from "lucide-react";
import { Person, ArrowRightToSquare } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client"; // Adjust path as needed
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // State for toggling between Login and Sign-up
  const [activeTab, setActiveTab] = useState("sign-up");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // type: 'error' | 'success'

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Collaborator",
    imageMode: "url", // 'url' or 'upload'
    imageUrl: "",
    imageFile: null,
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Handle Form Inputs
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: "", text: "" }); // Clear messages on type
  };

  // Password Validation
  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isMin6 = password.length >= 6;
    return hasUpper && hasLower && isMin6;
  };

  // ImgBB Upload Handler
  const uploadToImgBB = async (file) => {
    const data = new FormData();
    data.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: data },
    );

    const result = await response.json();
    if (!result.success) throw new Error("Failed to upload image.");
    return result.data.url;
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setMessage({
        type: "error",
        text: error.message || "Google login failed",
      });
      setLoading(false);
    }
  };

  // Main Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (activeTab === "sign-up") {
        // 1. Validate Password
        if (!validatePassword(formData.password)) {
          throw new Error(
            "Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.",
          );
        }

        // 2. Handle Image
        let finalImageUrl = formData.imageUrl;
        if (formData.imageMode === "upload" && formData.imageFile) {
          finalImageUrl = await uploadToImgBB(formData.imageFile);
        }

        // 3. Register via Better Auth
        const { error } = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          image: finalImageUrl,
          role: formData.role,
        });

        if (error) throw new Error(error.message || "Sign up failed");

        setMessage({
          type: "success",
          text: "Account created successfully! Redirecting...",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        // Login via Better Auth
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw new Error(error.message || "Invalid credentials");

        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-default-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Card.Header className="flex flex-col gap-1 pb-0 pt-6 px-6">
          <div className="flex w-full rounded-md bg-default-100/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "login"
                  ? "bg-white dark:bg-zinc-900 shadow"
                  : "bg-transparent"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sign-up")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "sign-up"
                  ? "bg-white dark:bg-zinc-900 shadow"
                  : "bg-transparent"
              }`}
            >
              Sign up
            </button>
          </div>
        </Card.Header>

        <Card.Content className="px-6 py-4 overflow-hidden">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 mb-4 rounded-md text-sm font-medium ${
                message.type === "error"
                  ? "bg-danger-50 text-danger"
                  : "bg-success-50 text-success"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "sign-up" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "sign-up" ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* Name Field (Sign-up only) */}
              {activeTab === "sign-up" && (
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                  variant="bordered"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  startContent={<Person className="text-default-400 w-4 h-4" />}
                />
              )}

              {/* Email Field */}
              <Input
                isRequired
                label="Email"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              {/* Password Field */}
              <Input
                isRequired
                label="Password"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                variant="bordered"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                description={
                  activeTab === "sign-up" &&
                  "Min 6 chars, 1 uppercase, 1 lowercase"
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOff className="text-default-400 pointer-events-none w-5 h-5" />
                    ) : (
                      <Eye className="text-default-400 pointer-events-none w-5 h-5" />
                    )}
                  </button>
                }
              />

              {/* Extra Sign-up Fields */}
              {activeTab === "sign-up" && (
                <>
                  {/* HeroUI v3 Compound Component Select */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-default-600">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-white dark:bg-zinc-900"
                      aria-label="Select Role"
                    >
                      <option value="Founder">Founder</option>
                      <option value="Collaborator">Collaborator</option>
                    </select>
                  </div>

                  {/* Profile Image Handlers */}
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-default-600">Profile Image</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChange("imageMode", "url")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          formData.imageMode === "url"
                            ? "bg-white dark:bg-zinc-900 shadow"
                            : "bg-transparent"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <ImageIcon size={14} /> URL
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("imageMode", "upload")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          formData.imageMode === "upload"
                            ? "bg-white dark:bg-zinc-900 shadow"
                            : "bg-transparent"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Upload size={14} /> Upload
                        </span>
                      </button>
                    </div>

                    {formData.imageMode === "url" ? (
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        variant="bordered"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          handleChange("imageUrl", e.target.value)
                        }
                      />
                    ) : (
                      <Input
                        type="file"
                        variant="bordered"
                        accept="image/*"
                        onChange={(e) =>
                          handleChange("imageFile", e.target.files[0])
                        }
                        classNames={{ input: "pt-2" }}
                      />
                    )}
                  </div>
                </>
              )}

              <Button
                color="primary"
                type="submit"
                isLoading={loading}
                className="w-full mt-2 font-medium"
                endContent={
                  !loading &&
                  (activeTab === "login" ? (
                    <ArrowRightToSquare width={18} />
                  ) : null)
                }
              >
                {activeTab === "sign-up" ? "Create Account" : "Sign In"}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <p className="text-default-500 text-sm">OR</p>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="bordered"
                isLoading={loading}
                onClick={handleGoogleLogin}
                className="w-full font-medium"
                startContent={
                  !loading && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )
                }
              >
                Continue with Google
              </Button>
            </motion.form>
          </AnimatePresence>
        </Card.Content>
      </Card>
    </div>
  );
}
