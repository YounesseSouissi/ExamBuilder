import PageHead from '../../components/shared/page-head';
import ForgotPasswordForm from '../../components/form/ForgotPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function ForgotPassword() {
    return (
        <>
            <PageHead title="Reset Password - ExamBuilder" />
            <Card className="w-full max-w-sm shadow-2xl dark:shadow-secondary">
                <CardHeader className='text-center'>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your user account's verified email address and we will send you a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
            </Card>
        </>
    )
}
