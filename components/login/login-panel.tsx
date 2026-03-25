import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login/login-form"
import { SocialAuth } from "@/components/login/social-auth"

export function LoginPanel() {
  return (
    <Card className="login-animate">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Vui lòng nhập thông tin để truy cập hệ thống học tập.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <SocialAuth />
      </CardContent>
    </Card>
  )
}
