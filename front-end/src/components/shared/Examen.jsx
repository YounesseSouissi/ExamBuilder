import React from 'react'
import Heading from './heading'
import { Check, RefreshCw } from 'lucide-react'
import { Checkbox } from "../ui/checkbox"
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
export default function Examen({ modalClose, examen, ids, setIds, handleUpdate, isLoading, setOpen }) {

    return (
        <div className="px-2 py-2">
            <Heading
                title={'Exam Question'}
                className="space-y-2 py-3 text-center"
            />
            <div className='h-full'>
                <ol className=" space-y-2">
                    {examen.map((question, index) => (
                        <div key={index}>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={ids?.includes(question.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? setIds([...ids, question.id])
                                            : setIds(
                                                ids?.filter(
                                                    (value) => value !== question.id
                                                )
                                            )
                                    }}
                                />
                                <li>{index + 1}-{question.question_text}</li>
                            </div>
                            <ol className=" ml-5 md:space-y-1.5">
                                {JSON.parse(question.reponses).map((reponse, idx) => (
                                    reponse.correcte ?
                                        <span className='flex space-x-4'><li key={idx}>{String.fromCharCode(97 + idx)}){reponse.reponse_text}</li> <Check className='text-green-500'/> </span>:
                                        <li key={idx}>{String.fromCharCode(97 + idx)}){reponse.reponse_text}</li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </ol>
            </div>
            <div className="flex items-center justify-end gap-2 mt-10  sm:space-x-0">
                <Button
                    disabled={isLoading}
                    type="button"
                    variant="outline"
                    onClick={modalClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={handleUpdate}
                    className={'bg-blue-500 hover:bg-blue-400'}
                >
                    <RefreshCw className={`mx-2 my-2  ${isLoading && 'animate-spin'}`} /> Update
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    Next
                </Button>
            </div>
        </div >
    )
}
