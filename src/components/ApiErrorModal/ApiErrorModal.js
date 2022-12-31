import './ApiErrorModal.scss'

import { useEffect } from 'react';
import { useContext } from 'react';
import { ApiErrorContext } from '../../context/datacontext';

export function APIErrorModal() {
  const modalDuration = 5
  const errorContext = useContext(ApiErrorContext)

  useEffect(() => {
    if (errorContext.error)
      setTimeout(() => {
        console.log('aaa',errorContext.error)
        errorContext.setError(null)
      }, modalDuration * 1000);
  }, [errorContext])

  return (
    errorContext.error ? <div style={{ animationDuration: modalDuration + 's' }} className='ApiErrorModal'>{errorContext.error}</div> : null
  )
}