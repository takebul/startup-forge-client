"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Input, Button, Separator, Tabs, Tab } from "@heroui/react";
import { Eye, EyeOff, Image as ImageIcon, Upload } from "lucide-react";
import Person from "@gravity-ui/icons/Person";
import ArrowRightToSquare from "@gravity-ui/icons/ArrowRightToSquare";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState("sign-up");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageMode: "url",
    imageUrl: "",
    imageFile: null,
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: "", text: "" });
  };

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isMin6 = password.length >= 6;
    return hasUpper && hasLower && isMin6;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (activeTab === "sign-up") {
        if (!validatePassword(formData.password)) {
          throw new Error(
            "Password must be at least 6 characters, with 1 uppercase and 1 lowercase letter.",
          );
        }

        let finalImageUrl = formData.imageUrl;
        if (formData.imageMode === "upload" && formData.imageFile) {
          finalImageUrl = await uploadToImgBB(formData.imageFile);
        }

        const payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        };
        if (finalImageUrl) payload.image = finalImageUrl;

        const result = await authClient.signUp.email(payload);

        if (result?.error) {
          console.error("Sign-up API error:", result);
          const serverMsg =
            result.error?.message ||
            result.error?.details ||
            JSON.stringify(result);
          throw new Error(serverMsg || "Sign up failed");
        }

        if (!result) {
          console.error("Sign-up returned empty result", result);
          throw new Error("Sign up failed: empty response from auth client");
        }

        setMessage({
          type: "success",
          text: "Account created successfully! Redirecting...",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-100 to-default-200 p-4">
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-zinc-900/80">
        {/* Card Header */}
        <Card.Header className="flex flex-col items-center gap-2 pb-0 pt-8 px-8">
          <div className="text-2xl font-bold text-foreground">Welcome Back</div>
          <p className="text-sm text-default-500">
            {activeTab === "sign-up"
              ? "Create a new account"
              : "Sign in to your account"}
          </p>
        </Card.Header>

        {/* Tab Switcher */}
        <Card.Body className="px-8 py-6">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            fullWidth
            size="lg"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-0 w-full",
              cursor: "w-full",
              tab: "h-12 font-medium",
            }}
          >
            <Tab key="login" title="Login" />
            <Tab key="sign-up" title="Sign Up" />
          </Tabs>

          {/* Messages */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-3 rounded-lg text-sm font-medium ${
                message.type === "error"
                  ? "bg-danger-50 text-danger-600 dark:bg-danger-400/20 dark:text-danger-400"
                  : "bg-success-50 text-success-600 dark:bg-success-400/20 dark:text-success-400"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 mt-6"
            >
              {/* Name (Sign-up only) */}
              {activeTab === "sign-up" && (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  type="text"
                  required
                  startContent={<Person className="text-default-400 w-4 h-4" />}
                  value={formData.name ?? ""}
                  onValueChange={(v) => handleChange("name", v)}
                  variant="bordered"
                  color="primary"
                  size="lg"
                  labelPlacement="outside"
                />
              )}

              {/* Email */}
              <Input
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                value={formData.email ?? ""}
                onValueChange={(v) => handleChange("email", v)}
                variant="bordered"
                color="primary"
                size="lg"
                labelPlacement="outside"
              />

              {/* Password */}
              <Input
                label="Password"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                required
                value={formData.password ?? ""}
                onValueChange={(v) => handleChange("password", v)}
                variant="bordered"
                color="primary"
                size="lg"
                labelPlacement="outside"
                description={
                  activeTab === "sign-up"
                    ? "Min 6 characters, 1 uppercase, 1 lowercase"
                    : undefined
                }
                endContent={
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="focus:outline-none"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? (
                      <EyeOff className="text-default-400 w-5 h-5" />
                    ) : (
                      <Eye className="text-default-400 w-5 h-5" />
                    )}
                  </button>
                }
              />

              {/* Image section (Sign-up only) */}
              {activeTab === "sign-up" && (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-default-600">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        formData.imageMode === "url" ? "solid" : "bordered"
                      }
                      color="primary"
                      onClick={() => handleChange("imageMode", "url")}
                      startContent={<ImageIcon size={14} />}
                    >
                      URL
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        formData.imageMode === "upload" ? "solid" : "bordered"
                      }
                      color="primary"
                      onClick={() => handleChange("imageMode", "upload")}
                      startContent={<Upload size={14} />}
                    >
                      Upload
                    </Button>
                  </div>
                  {formData.imageMode === "url" ? (
                    <Input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.imageUrl ?? ""}
                      onValueChange={(v) => handleChange("imageUrl", v)}
                      variant="bordered"
                      color="primary"
                      size="sm"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("imageFile", e.target.files[0])
                      }
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary-600 transition-colors"
                    />
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                color="primary"
                type="submit"
                isLoading={loading}
                size="lg"
                className="w-full font-semibold mt-2"
                endContent={
                  !loading && activeTab === "login" ? (
                    <ArrowRightToSquare width={18} />
                  ) : null
                }
              >
                {activeTab === "sign-up" ? "Create Account" : "Sign In"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="text-xs font-medium text-default-400">
                  OR CONTINUE WITH
                </span>
                <Separator className="flex-1" />
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="bordered"
                size="lg"
                isLoading={loading}
                onClick={handleGoogleLogin}
                className="w-full font-medium border-default-300"
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
        </Card.Body>
      </Card>
    </div>
  );
}
