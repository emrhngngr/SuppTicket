'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

const CreateCompanyModal = ({
  isOpen,
  onClose,
  isLoading,
  isSaving,
  createForm,
  onInputChange,
  onSubmit
}: any) => {
  if (!isOpen) return null

  const [startDate, setStartDate] = React.useState<Date | undefined>(createForm.start_date ? new Date(createForm.start_date) : undefined)
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>(createForm.expiry_date ? new Date(createForm.expiry_date) : undefined)

  // Tarih seçildiğinde form verisini güncelle
  const handleDateChange = (date: Date, field: string) => {
    if (field === 'start_date') {
      setStartDate(date)
    } else {
      setExpiryDate(date)
    }
    onInputChange({ target: { name: field, value: format(date, 'yyyy-MM-dd') } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                className='mt-3'
                value={createForm.name}
                onChange={onInputChange}
                required
              />
            </div>

            {/* Company Status */}
            <div>
              <Label htmlFor="status" className='mb-2'>Status</Label>
              <Select value={createForm.status} onValueChange={(value) => onInputChange({ target: { name: 'status', value } })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Type */}
            <div>
              <Label className='mb-2' htmlFor="license_type">License Type <span className="text-red-500">*</span></Label>
              <Select value={createForm.license_type} onValueChange={(value) => onInputChange({ target: { name: 'license_type', value } })}>
                <SelectTrigger id="license_type">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <Label>Start Date <span className="text-red-500 mb-2">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Select start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && handleDateChange(date, 'start_date')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Expiry Date */}
            <div>
              <Label>Expiry Date <span className="text-red-500 mb-2">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, 'PPP') : <span>Select expiry date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => date && handleDateChange(date, 'expiry_date')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isSaving ? 'Saving...' : 'Create Company'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateCompanyModal
