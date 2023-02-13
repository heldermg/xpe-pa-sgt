import { useMutation, useQuery } from '@apollo/client'
import { getOperationName } from '@apollo/client/utilities'
import { Absence, AbsenceType, User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import {
  ABSENCE_CREATE_MUTATION,
  ABSENCE_QUERY,
  ABSENCE_UPDATE_MUTATION,
} from '../../pages/api/query/absences/absences-queries'
import { FormType } from '../form-util'
import SvgIcon from '../icons/SvgIcon'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker from 'react-datepicker'
import { USERS_QUERY } from '../../pages/api/query/users/users-queries'
import { ABSENCE_TYPE_QUERY } from '../../pages/api/query/absenceTypes/absenceTypes-queries'

type FormValues = {
  title: string
  description: string
  startDateAt: Date
  endDateAt: Date
  startTimeAt?: Date
  endTimeAt?: Date
  isAllDay: boolean
  userId: string
  absenceTypeId: string
  users?: string[]
  absenceTypes?: string[]
}

interface AbsenceFormProps {
  absence?: Absence
  users?: string[]
  absenceTypes?: string[]
}

export const AbsenceForm = ({
  absence,
  users,
  absenceTypes,
}: AbsenceFormProps) => {
  const {
    id,
    title,
    description,
    startDateAt,
    endDateAt,
    startTimeAt,
    endTimeAt,
    isAllDay,
    userId,
    absenceTypeId,
  } = absence || {}

  const isEdit = id ? true : false
  let formType: FormType = id ? FormType.EDIT : FormType.NEW

  const buttonLabel = isEdit ? 'Update Absence' : 'Create new Absence'
  const loadingButtonLabel = isEdit ? 'Updating...' : 'Creating...'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt: startTimeAt ? startTimeAt : undefined,
      endTimeAt: endTimeAt ? endTimeAt : undefined,
      isAllDay,
      userId,
      absenceTypeId,
      users: users ? users : undefined,
      absenceTypes: absenceTypes ? absenceTypes : undefined,
    },
  })

  const [createAbsence, { loading: loadingCreate, error: errorCreate }] =
    useMutation(ABSENCE_CREATE_MUTATION, {
      refetchQueries: [{ query: USERS_QUERY }, { query: ABSENCE_TYPE_QUERY }],
    })

  const [updateAbsence, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(ABSENCE_UPDATE_MUTATION, {
      refetchQueries: [{ query: ABSENCE_QUERY }],
    })

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(USERS_QUERY, {
    variables: {
      onlyWithTeam: true,
    },
    fetchPolicy: 'no-cache',
  })

  if (usersError) return <p>Oh no... {usersError.message}</p>

  const {
    data: absenceTypesData,
    loading: absenceTypesLoading,
    error: absenceTypesError,
  } = useQuery(ABSENCE_TYPE_QUERY, {
    fetchPolicy: 'no-cache',
  })

  if (absenceTypesError) return <p>Oh no... {absenceTypesError.message}</p>

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const {
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt,
      endTimeAt,
      isAllDay,
      userId,
      absenceTypeId,
    } = data
    const variables = {
      id: isEdit ? id : null,
      title,
      description,
      startDateAt,
      endDateAt,
      startTimeAt,
      endTimeAt,
      isAllDay,
      userId,
      absenceTypeId,
    }
    try {
      if (isEdit) {
        await toast.promise(updateAbsence({ variables }), {
          loading: 'Updating the Absence...',
          success: 'Absence successfully updated!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      } else {
        await toast.promise(createAbsence({ variables }), {
          loading: 'Creating new Absence...',
          success: 'Absence successfully created!🎉',
          error: (err) => `Something went wrong 😥\nMessage:\n ${err?.message}`,
        })
      }
    } catch (error: any) {
      console.error(error?.message)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5 text-center">
        {formType} Absence
      </h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            {...register('title', { required: true })}
            name="title"
            type="text"
            maxLength={30}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            placeholder="Description"
            {...register('description', { required: true })}
            name="description"
            rows={4}
            maxLength={200}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">User</span>
          {usersLoading ? (
            <span>Loandig users</span>
          ) : (
            <select
              required={true}
              placeholder="User"
              {...register('userId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {usersData?.users.edges.map(({ node }: { node: User }) => (
                <option key={node.id} value={node.id}>
                  {node.name} - {node.email}
                </option>
              ))}
            </select>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Absence Type</span>
          {absenceTypesLoading ? (
            <span>Loandig absence types</span>
          ) : (
            <select
              required={true}
              placeholder="Absence Type"
              {...register('absenceTypeId', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {absenceTypesData?.absenceTypes.edges.map(({ node }: { node: AbsenceType }) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          )}
        </label>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Date</span>
            <Controller
              control={control}
              name="startDateAt"
              render={({ field }) => (
                <ReactDatePicker
                  required
                  className="w-2/3"
                  shouldCloseOnSelect={true}
                  placeholderText="dd/MM/yyyy"
                  onChange={(date: any) => field.onChange(date)}
                  selected={field.value}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Date</span>
            <Controller
              control={control}
              name="endDateAt"
              render={({ field }) => (
                <ReactDatePicker
                  required
                  className="w-2/3"
                  shouldCloseOnSelect={true}
                  placeholderText="dd/MM/yyyy"
                  onChange={(date: any) => field.onChange(date)}
                  selected={field.value}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
          </span>
        </span>
        <span className="flex flex-row">
          <span className="block">
            <span className="text-gray-700">Start Time</span>
            <Controller
              control={control}
              name="startTimeAt"
              render={({ field }) => (
                <ReactDatePicker
                  className="w-2/3"
                  showTimeSelect={true}
                  showTimeSelectOnly={true}
                  shouldCloseOnSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="HH:mm"
                  onChange={(date: any) => field.onChange(date)}
                  selected={field.value}
                  dateFormat="HH:mm"
                />
              )}
            />
          </span>
          <span className="block">
            <span className="text-gray-700">End Time</span>
            <Controller
              control={control}
              name="endTimeAt"
              render={({ field }) => (
                <ReactDatePicker
                  className="w-2/3"
                  showTimeSelect={true}
                  showTimeSelectOnly={true}
                  shouldCloseOnSelect={true}
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  placeholderText="HH:mm"
                  onChange={(date: any) => field.onChange(date)}
                  selected={field.value}
                  dateFormat="HH:mm"
                />
              )}
            />
          </span>
        </span>

        <button
          disabled={loadingCreate || loadingUpdate}
          type="submit"
          className="capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loadingCreate || loadingUpdate ? (
            <span className="flex items-center justify-center">
              <SvgIcon
                iconType="animate-spin"
                className="w-6 h-6 animate-spin mr-1"
                title="Animate Spin"
                desc="Animate Spin"
              />
              <span>{loadingButtonLabel}</span>
            </span>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
        <Link href={`/absences/`}>
          <a className="w-full">
            <button
              type="button"
              className="w-full capitalize bg-gray-500 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Voltar
            </button>
          </a>
        </Link>
      </form>
    </div>
  )
}
