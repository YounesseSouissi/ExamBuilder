import React from 'react'
import RegisterForm from '../../components/form/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import PageHead from '../../components/shared/page-head';

export default function Register() {
  return (
    <>
          <PageHead title="Sign Up - ExamBuilder" />
      <Card className="w-full max-w-sm shadow-2xl dark:shadow-secondary">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <RegisterForm />
        </CardContent>
      </Card>
    </>
  )
}
