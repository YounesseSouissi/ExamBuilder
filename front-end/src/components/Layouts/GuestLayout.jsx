import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'
import { cn } from '../../lib/utils'
import { buttonVariants } from '../ui/button'
import { ModeToggle } from '../shared/theme-toggle'
import { useRouter } from '../../routes/hooks/use-router'
import image from '../../assets/login.png'
import logo from '../../assets/logo.png'
export default function GuestLayout() {
  const router = useRouter()
  const { token, setToken } = useUserContext()
  useEffect(() => {
    if (token) {
      setToken(token)
      return router.back();
    }
  }, [token])
  if (token) {
    return <></>
  }
  return (
    <>
      <div className="relative h-screen  lg:flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex">
          <div className="absolute inset-0  dark:bg-secondary" />
          <div className="relative z-20 flex items-center  text-lg font-medium ">
            <img src={logo} alt="" className='h-12' />
            <span className='text-3xl text-primary'>ExamBuilder</span>
          </div>
          <img
            src={image}
            alt="Image"
            className=" w-full object-contain grayscale-[0.1] md:max-h-[20vh] xl:max-h-[80vh] lg:max-h-[85vh]"
          />

        </div>
        <div className="flex flex-col h-full md:w-screen lg:w-full items-center p-4 lg:p-4">
          <div className="ml-4 flex items-center lg:justify-end justify-between w-full md:ml-6 space-x-2 px-4 py-2">
            <div className="flex items-center lg:hidden text-lg font-medium ">
              <img src={logo} alt="" className='h-12' />
              <span className='text-3xl text-primary'>ExamBuilder</span>
            </div>
            <div className=' flex items-center'>
              <Link
                to="/register"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'md:right-8 md:top-8'
                )}
              >
                Register
              </Link>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'md:right-8 md:top-8'
                )}
              >
                Login
              </Link>
              <ModeToggle />
            </div>
          </div>
          <div className="mx-auto flex h-full flex-col justify-center space-y-6 w-[350px]">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}
