import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import t from "@/locales/en.json";

function AuthenticationV2() {
  const data = useActionData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#fab833]">BugTracker</h1>
          <p className="text-[#8a8784] mt-1 text-sm">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <Card className="bg-[#2e2e2e] border-[#3a3a3a] shadow-xl">
          <CardHeader className="pb-4">
            {/* Login / Signup Tab Switcher */}
            <Tabs value={isLogin ? "login" : "signup"} className="w-full">
              <TabsList className="w-full bg-[#1f1f1f] border border-[#3a3a3a]">
                <TabsTrigger
                  value="login"
                  className="flex-1 data-[state=active]:bg-[#fab833] data-[state=active]:text-[#1a1a1a] text-[#8a8784]"
                  asChild
                >
                  <Link to="?mode=login">{t.auth.title_login}</Link>
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="flex-1 data-[state=active]:bg-[#fab833] data-[state=active]:text-[#1a1a1a] text-[#8a8784]"
                  asChild
                >
                  <Link to="?mode=signup">{t.auth.title_signup}</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <Form method="post">
            <CardContent className="space-y-4">

              {/* Error messages */}
              {data && data.errors && (
                <div className="bg-red-900/30 border border-red-700 rounded-md px-4 py-3">
                  <ul className="space-y-1">
                    {Object.values(data.errors).map((err) => (
                      <li key={err} className="text-red-400 text-sm">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data && data.message && (
                <div className="bg-red-900/30 border border-red-700 rounded-md px-4 py-3">
                  <p className="text-red-400 text-sm">{data.message}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#ccc9c6]">
                  {t.auth.label_email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="bg-[#1f1f1f] border-[#3a3a3a] text-[#f4f3f1] placeholder:text-[#656360] focus-visible:ring-[#fab833] focus-visible:border-[#fab833]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#ccc9c6]">
                  {t.auth.label_password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="bg-[#1f1f1f] border-[#3a3a3a] text-[#f4f3f1] placeholder:text-[#656360] focus-visible:ring-[#fab833] focus-visible:border-[#fab833]"
                />
              </div>

              {/* Signup-only fields */}
              {!isLogin && (
                <>
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[#ccc9c6]">
                      {t.auth.label_name}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Your full name"
                      className="bg-[#1f1f1f] border-[#3a3a3a] text-[#f4f3f1] placeholder:text-[#656360] focus-visible:ring-[#fab833] focus-visible:border-[#fab833]"
                    />
                  </div>

                  {/* User Type */}
                  <div className="space-y-2">
                    <Label className="text-[#ccc9c6]">
                      {t.auth.label_userType}
                    </Label>
                    <RadioGroup
                      name="userType"
                      required
                      className="flex gap-4"
                      defaultValue="developer"
                    >
                      {[
                        { value: "developer", label: t.auth.role_developer },
                        { value: "manager", label: t.auth.role_manager },
                        { value: "qa", label: t.auth.role_qa },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={value}
                            id={value}
                            className="border-[#fab833] text-[#fab833]"
                          />
                          <Label
                            htmlFor={value}
                            className="text-[#aeaba7] cursor-pointer"
                          >
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#fab833] hover:bg-[#f9c762] text-[#1a1a1a] font-semibold transition-colors"
              >
                {isSubmitting
                  ? t.auth.btn_submitting
                  : isLogin
                  ? t.auth.title_login
                  : t.auth.title_signup}
              </Button>
            </CardFooter>
          </Form>
        </Card>

        {/* Bottom link */}
        <p className="text-center text-sm text-[#8a8784] mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            to={`?mode=${isLogin ? "signup" : "login"}`}
            className="text-[#fab833] hover:text-[#f9c762] font-medium"
          >
            {isLogin ? t.auth.link_createUser : t.auth.link_login}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthenticationV2;
