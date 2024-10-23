import React, { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Button } from '../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { format } from "date-fns"
import { cn } from "../../lib/utils"
import { Calendar } from '../../components/ui/calendar';
import { toast } from 'sonner';
import UserApi from '../../service/UserApi';
import Password from './Password';
const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name is Required",
  }).max(50),
  lastname: z.string().min(2, {
    message: "Last name is Required",
  }).max(50),
  date_of_birth: z.date({
    required_error: "A date of birth is required",
  }),
  gender: z.enum(['f', 'm'], {
    required_error: "You need to select a gender",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters",
  }).max(10),
  email: z.string().email({ message: 'Enter a valid email address' }),

});

export default function InfoPersonnele({ setEditInfo }) {
  const { user, setUser } = useUserContext();
  const defaultValues = {
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || user
  });
  useEffect(() => {
    form.setValue('gender', user.gender)
    form.setValue('firstname', user.firstname)
    form.setValue('lastname', user.lastname)
    form.setValue('date_of_birth', user.date_of_birth)
    form.setValue('phone', user.phone)
    form.setValue('email', user.email)
  }, [user])
  const { formState: { isSubmitting } } = form

  const onSubmit = async (values) => {
    try {
      const response = await UserApi.updateProfile({ ...values, date_of_birth: format(values.date_of_birth, 'y/M/d') })
      if (response.status == 200) {
        setUser(response.data.user);
        toast.success(response.data.message)
        setEditInfo(false)
      }

    } catch ({ response }) {
      if (response.status == 422) {
        Object.entries(response.data.errors).forEach(([key, value]) => {
          form.setError(key, {
            message: value
          })
        })
      };
    }
  }
  return (
    <>
      <div className="px-4 py-3 ">
        <h3 className="font-sm text-muted-foreground  mb-2">
          Personal Information
        </h3>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex  space-x-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="m" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="f" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Last name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Phone Number"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end  gap-2 pt-2 sm:space-x-0">
                <Button variant='ghost' onClick={() => setEditInfo(false)} >
                  Cancel
                </Button>
                <Button type="submit " disabled={isSubmitting} >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div>
          <Password />
        </div>
      </div>
    </>
  )
}