import PageHead from '../../components/shared/page-head';
import ResetPasswordForm from '../../components/form/ResetPasswordForm'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function ResetPassword() {
    return (
        <>
            <PageHead title="New Password - ExamBuilder" />
            <Card className="w-full max-w-sm shadow-2xl dark:shadow-secondary">
                <CardHeader className='text-center'>
                    <CardTitle className="text-xl">Add your new password</CardTitle>
                    {/* <CardDescription>
                        Enter your user account's verified email address and we will send you a password reset link.
                    </CardDescription> */}
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm />
                </CardContent>
            </Card>
        </>
    )
}
