import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import {
  Tabs,
  TabsContent,
} from '../../../components/ui/tabs';
import { CircleHelpIcon, ComponentIcon, MessageCircleReplyIcon, NotebookTextIcon, UsersIcon } from 'lucide-react'
import { useGetCounts } from './queries/queries'
import { useState, useEffect } from 'react';
import Overview from './OverView';
import { useUserContext } from '../../../context/UserContext';
import Chart from './Chart';
import PageHead from '../../../components/shared/page-head';
export default function Dashboard() {
  const { user } = useUserContext()
  const [counts, setCounts] = useState({})
  const { data } = useGetCounts()
  useEffect(() => {
    if (data) {
      setCounts(data.data.counts)
    }
  }, [data])
  return (
    <>
      <PageHead title="Dashboard - ExamBuilder" />
      {data &&
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Hi, Welcome back {user.lastname} 👋
            </h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className={'bg-secondary'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Users
                    </CardTitle>
                    <UsersIcon className="w-5 h-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{counts.users}</div>
                  </CardContent>
                </Card>
                <Card className={'bg-secondary'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Modules</CardTitle>
                    <ComponentIcon className="w-5 h-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{counts.modules}</div>
                  </CardContent>
                </Card>
                <Card className={'bg-secondary'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Chapitres
                    </CardTitle>
                    <NotebookTextIcon className="w-5 h-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{counts.chapitres}</div>
                  </CardContent>
                </Card>
                <Card className={'bg-secondary'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Questions
                    </CardTitle>
                    <CircleHelpIcon className="w-5 h-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{counts.questions}</div>
                  </CardContent>
                </Card>
                <Card className={'bg-secondary'}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Reponses
                    </CardTitle>
                    <MessageCircleReplyIcon className="w-5 h-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{counts.reponses}</div>
                  </CardContent>
                </Card>
              </div>
              <h1 className='text-2xl font-bold'>Statistique</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 md:col-span-3">
                  <CardContent className="pl-2">
                    <CardHeader>
                    </CardHeader>
                    <Overview counts={counts} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 ">
                  <CardHeader>
                    <CardTitle className="text-3xl font-medium mb-4">
                      Questions
                    </CardTitle>
                    <div className="flex gap-8">
                      <div className="flex space-x-1 items-center">
                        <p className=" w-10 h-4 rounded-sm" style={{ 'backgroundColor': '#00C49F' }}></p> <span>Facile</span>
                      </div>
                      <div className="flex space-x-1 items-center">
                        <p className=" w-10 h-4 rounded-sm" style={{ 'backgroundColor': '#FFBB28' }}></p> <span>Moyen</span>
                      </div>
                      <div className="flex space-x-1 items-center">
                        <p className=" w-10 h-4 rounded-sm" style={{ 'backgroundColor': '#FF8042' }}></p> <span>Difficile</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex justify-center'>
                    <Chart counts={counts} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
    </>
  );
};

