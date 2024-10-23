import PageHead from '../../components/shared/page-head';
import LoginForm from '../../components/form/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function Login() {
  return (
    <>
      <PageHead title="Sign In - ExamBuilder" />
      <Card className="w-full max-w-sm shadow-2xl dark:shadow-secondary">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </>
  );
}