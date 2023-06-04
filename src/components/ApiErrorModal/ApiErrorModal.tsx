import './ApiErrorModal.scss'
import React from 'react'
import { useEffect, useContext } from 'react';
import { ApiErrorContext } from '../../context/datacontext';

export function APIErrorModal() {
  const modalDuration: number = 5
  const errorContext = useContext(ApiErrorContext)

  useEffect(() => {
    if (errorContext.error)
      setTimeout(() => {
        errorContext.setError("")
      }, modalDuration * 1000);
  }, [errorContext])

  return (
    errorContext.error ? <div style={{ animationDuration: modalDuration + 's' }} className='ApiErrorModal'>{errorContext.error}</div> : null
  )
}