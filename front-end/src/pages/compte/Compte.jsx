import React, { useState } from 'react'
import InfoPersonnele from './InfoPersonnele'
import Photo from './Photo'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { useUserContext } from '../../context/UserContext'
import { Button } from '../../components/ui/button'
import { format } from 'date-fns'
import PageHead from '../../components/shared/page-head';

export default function Compte() {
    const [editPhoto, setEditPhoto] = useState(false)
    const [editInfo, setEditInfo] = useState(false)
    const { user } = useUserContext()
    return (
        <>
            <PageHead title="Compte - ExamBuilder" />
            <div className="grid  grid-cols-4 gap-6 py-6 ">
                <div className="  flex flex-col gap-6 col-span-5 lg:col-span-1">
                    {!editPhoto ?
                        <Card className="bg-muted/30  shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between font-bold">
                                <p className="text-xl"> Profile</p>
                                <Button variant='background' className='underline text-primary' onClick={() => setEditPhoto(true)} >Edit</Button>
                            </CardHeader>
                            <CardContent className="flex items-center h-56  justify-center">
                                <img
                                    src={'import.meta.env.VITE_BASE_URL_BACK_END_API/storage/' + user.photo}
                                    className="rounded-l-[40%]  h-full rounded-r-[40%]  md:w-52 "
                                />
                            </CardContent>
                        </Card>
                        :
                        <Photo setEditPhoto={setEditPhoto} />
                    }
                </div>
                {!editInfo ?
                    <Card className=" col-span-5 lg:col-span-3 bg-muted/30 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
                        <CardHeader className="text-xl font-bold">
                            Coordonnées
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="font-bold">First Name</p>
                                    <p className="text-muted-foreground">{user.firstname}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Last Name</p>
                                    <p className="text-muted-foreground">{user.lastname}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Sex</p>
                                    <p className="text-muted-foreground">{user.gender && (user.gender === 'm' ? 'Male' : 'Female')}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Contact Email</p>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Phone Number</p>
                                    <p className="text-muted-foreground">{user.phone}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Date of Birth</p>
                                    <p className="text-muted-foreground">{user.date_of_birth && format(user.date_of_birth, 'P')}</p>
                                </div>
                            </div>
                            <div className='flex justify-end mt-3'>
                                <Button className={'bg-red-500 hover:bg-red-400'} onClick={() => setEditInfo(true)}>Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                    :
                    (
                        <div
                            className="rounded-sm col-span-5 lg:col-span-3 border border-stroke bg-muted/30 shadow-default dark:border-strokedark "
                        >
                            <div
                                className="border-b border-stroke px-4 py-3 dark:border-strokedark"
                            >
                                <h3 className="font-medium text-black dark:text-white">
                                    Coordonnées
                                </h3>
                            </div>
                            <InfoPersonnele setEditInfo={setEditInfo} />
                        </div>
                    )
                }
            </div>
        </>
    )
}
