import { useEffect } from 'react';
import { useContext } from 'react';
import { ApiErrorContext } from '../../context/datacontext';

export function APIErrorModal() {
  const errorContext = useContext(ApiErrorContext)

  useEffect(() => {
    if (errorContext.error)
      setTimeout(() => {
        console.log('ooo')
        errorContext.setError(null)
      }, 4000);
  }, [errorContext])

  return (
    errorContext.error ? <div className='Error'>{errorContext.error}</div> : null
  )
}