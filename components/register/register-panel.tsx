import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/register/register-form"
import { SocialAuth } from "@/components/login/social-auth"

export function RegisterPanel() {
  return (
    <Card className="register-animate">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để bắt đầu học tiếng Nhật.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RegisterForm />
        <SocialAuth />
      </CardContent>
    </Card>
  )
}
