import PageHead from '../../../components/shared/page-head'
import { useUserContext } from '../../../context/UserContext'
import React from 'react'

export default function Home() {
    const { user } = useUserContext()
    return (
        <>
            <PageHead title="Home - ExamBuilder" />
            <div className='flex justify-center items-center mt-40 text-3xl'>
                <p>
                    Hi, Welcome back {user.lastname} {user.firstname} 👋
                </p>
            </div>
        </>

    )
}
